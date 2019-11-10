import { App, Duration, Fn, SecretValue } from '@aws-cdk/core';
import {
	CfnRoute,
	InstanceClass,
	InstanceSize,
	InstanceType,
	Peer,
	Port,
	SecurityGroup,
	SubnetType,
	Vpc,
} from '@aws-cdk/aws-ec2';
import { ContainerImage, EcsOptimizedImage, Protocol, LogDrivers } from '@aws-cdk/aws-ecs';
import { DatabaseInstanceEngine } from '@aws-cdk/aws-rds';
import { createConfig } from '@shared/lib/config/config-reader';
import { StackBuilder } from '@root/packages/sw-infra/lib/helper/stack-builder';
import { Compatibility, NetworkMode } from '@root/node_modules/@aws-cdk/aws-ecs';
import { Effect, ManagedPolicy, PolicyStatement, ServicePrincipal } from '@aws-cdk/aws-iam';

const env = process.env.NODE_ENV || 'production';
const config = createConfig(require('./config').config, env);

export async function buildSwStack() {
	const app = new App();
	const stackBuilder = new StackBuilder(app, 'stack', {
		env,
	});
	const associateEIPRole = createAssociateEIPRole(stackBuilder);
	createEIPs(stackBuilder);
	const vpc = createVpc(stackBuilder);
	const natInstance = createNatInstance(stackBuilder, vpc);
	stackBuilder.attachRolesToInstance('natInstanceProfileRole', natInstance, associateEIPRole);
	createRds(stackBuilder, vpc);
	createRedis(stackBuilder, vpc);
	//createECSCluster(stackBuilder, vpc);

	return stackBuilder.stack;
}

function createVpc(stackBuilder: StackBuilder) {
	return stackBuilder.vpc('vpc', {
		maxAzs: 2,
		cidr: '10.0.0.0/16',
		natGateways: 0,
	});
}

function createNatInstance(stackBuilder: StackBuilder, vpc: Vpc) {
	const natSecurityGroup = stackBuilder.securityGroup('natSecurityGroup', {
		vpc: vpc,
		description: 'NAT Instance Security Group',
		allowAllOutbound: true,
	});

	natSecurityGroup.connections.allowFromAnyIpv4(Port.allTcp());

	const natInstance = stackBuilder.ec2('NATInstance', {
		keyName: 'sw-ec2-key',
		tags: [
			{
				key: 'Name',
				value: 'swStack/swNatInstance',
			},
		],
		userData: Fn.base64(`#!/bin/bash
set -x
exec > >(tee /var/log/user-data.log|logger -t user-data ) 2>&1
yum update -y
yum install -y postgresql
yum install -y gcc
yum install -y git
wget http://download.redis.io/redis-stable.tar.gz && tar xvzf redis-stable.tar.gz && cd redis-stable && make
cp src/redis-cli /usr/bin/
yum install -y jq
yum install -y docker
service docker start
usermod -aG docker ec2-user
`),
		imageId: 'ami-00c1445796bc0a29f',
		instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.NANO).toString(),
		subnetId: vpc.publicSubnets[0].subnetId,
		securityGroupIds: [natSecurityGroup.securityGroupId],
		sourceDestCheck: false,
	});

	vpc.privateSubnets.forEach(subnet => {
		const defaultRoute = subnet.node.findChild('DefaultRoute') as CfnRoute;
		defaultRoute.addPropertyOverride('InstanceId', natInstance.ref);
	});

	return natInstance;
}

function createAssociateEIPRole(stackBuilder: StackBuilder) {
	const role = stackBuilder.role('associateEIPRole', {
		assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
	});

	role.addToPolicy(createAssociateEIPPolicyStatement());

	return role;
}

function createAssociateEIPPolicyStatement() {
	return new PolicyStatement({
		effect: Effect.ALLOW,
		resources: ['*'],
		actions: ['ec2:AssociateAddress', 'ec2:DescribeAddresses', 'ec2:DescribeTags', 'ec2:DescribeInstances'],
	});
}

function createRds(stackBuilder: StackBuilder, vpc: Vpc) {
	const rds = stackBuilder.rds('rds', {
		engine: DatabaseInstanceEngine.POSTGRES,
		engineVersion: '10.10',
		vpcPlacement: { subnetType: SubnetType.PRIVATE },
		databaseName: config.get('postgres:database'),
		instanceClass: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
		vpc,
		deleteAutomatedBackups: true,
		deletionProtection: false,
		masterUsername: config.get('postgres:username'),
		masterUserPassword: new SecretValue(config.get('postgres:password')),
	});

	const securityGroup = SecurityGroup.fromSecurityGroupId(
		stackBuilder.stack,
		'rdsSecurityGroup',
		rds.securityGroupId
	);
	securityGroup.addIngressRule(stackBuilder.get('natSecurityGroup') as SecurityGroup, Port.tcp(5432));
	return rds;
}

function createECSCluster(stackBuilder: StackBuilder, vpc: Vpc) {
	const cluster = stackBuilder.ecs('ecsCluster', {
		vpc,
	});

	const autoScalingGroup = stackBuilder.autoScalingGroup('ecsAutoScalingGroup', {
		instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
		maxCapacity: 1,
		vpc,
		vpcSubnets: {
			subnetType: SubnetType.PUBLIC,
		},
		desiredCapacity: 1,
		machineImage: EcsOptimizedImage.amazonLinux2(),
	});

	autoScalingGroup.addSecurityGroup(
		stackBuilder.securityGroup('ecsAutoScalingSecurityGroup', {
			vpc,
			ingressRules: [
				{
					port: Port.tcp(8081),
					peer: Peer.anyIpv4(),
				},
				{
					port: Port.tcp(8899),
					peer: Peer.anyIpv4(),
				},
			],
		})
	);

	autoScalingGroup.role.addManagedPolicy(
		ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceforEC2Role')
	);

	autoScalingGroup.role.addToPolicy(createAssociateEIPPolicyStatement());

	cluster.addAutoScalingGroup(autoScalingGroup, {
		spotInstanceDraining: false,
		taskDrainTime: Duration.seconds(0),
	});

	autoScalingGroup.addUserData('');

	const stellaTask = createStellaECSTask(stackBuilder);

	stackBuilder.ecsService('scyllaService', {
		cluster,
		taskDefinition: stellaTask,
	});
}

function createEIPs(stackBuilder: StackBuilder) {
	stackBuilder.eip('eip-1');
	stackBuilder.eip('eip-2');
}

function createStellaECSTask(stackBuilder: StackBuilder) {
	const executionRole = stackBuilder.role('ecsScyllaExecutionRole', {
		assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
	});
	executionRole.addManagedPolicy(
		ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
	);
	const taskDefinition = stackBuilder.ecsTask('ecsScyllaTask', {
		compatibility: Compatibility.EC2,
		memoryMiB: '512',
		cpu: '256',
		networkMode: NetworkMode.BRIDGE,
		executionRole,
	});

	const scyllaContainer = taskDefinition.addContainer('scyllaContainer', {
		image: ContainerImage.fromRegistry('wildcat/scylla'),
		logging: LogDrivers.awsLogs({ streamPrefix: 'ECSScylla' }),
		memoryLimitMiB: 512,
	});

	taskDefinition.addVolume({
		name: 'scylla',
	});

	scyllaContainer.addMountPoints({
		containerPath: '/var/www/scylla',
		readOnly: false,
		sourceVolume: 'scylla',
	});

	scyllaContainer.addPortMappings(
		{
			containerPort: 8081,
			hostPort: 8081,
			protocol: Protocol.TCP,
		},
		{
			containerPort: 8899,
			hostPort: 8899,
			protocol: Protocol.TCP,
		}
	);

	return taskDefinition;
}

function createRedis(stackBuilder: StackBuilder, vpc: Vpc) {
	const subnetGroup = stackBuilder.cacheSubnetGroup('cacheSubnet', {
		description: 'ElasticCache subnet group',
		subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
	});

	const redisSecurityGroup = stackBuilder.securityGroup('redisSecurityGroup', {
		vpc,
		allowAllOutbound: true,
		ingressRules: [
			{
				port: Port.tcp(6379),
				peer: stackBuilder.get('natSecurityGroup') as SecurityGroup,
			},
		],
	});
	const cluster = stackBuilder.cacheCluster('cluster', {
		cacheNodeType: 'cache.t2.micro',
		engine: 'redis',
		numCacheNodes: 1,
		autoMinorVersionUpgrade: true,
		cacheSubnetGroupName: subnetGroup.cacheSubnetGroupName,
		vpcSecurityGroupIds: [redisSecurityGroup.securityGroupId],
	});

	cluster.addDependsOn(subnetGroup);

	return cluster;
}
