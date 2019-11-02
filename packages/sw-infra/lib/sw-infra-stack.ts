import { App, Fn, SecretValue, Duration } from '@aws-cdk/core';
import {
	CfnRoute,
	InstanceClass,
	InstanceSize,
	InstanceType,
	Port,
	AmazonLinuxImage,
	SecurityGroup,
	SubnetType,
	Vpc,
	Peer,
} from '@aws-cdk/aws-ec2';
import { Protocol, ContainerImage, EcsOptimizedImage } from '@aws-cdk/aws-ecs';
import { DatabaseInstanceEngine } from '@aws-cdk/aws-rds';
import { createConfig } from '@shared/lib/config/config-reader';
import { StackBuilder } from '@root/packages/sw-infra/lib/helper/stack-builder';
import { Compatibility, NetworkMode } from '@root/node_modules/@aws-cdk/aws-ecs';
import { ManagedPolicy } from '@aws-cdk/aws-iam';

const config = createConfig(require('./config').config, process.env.NODE_ENV || 'production');

export async function buildSwStack() {
	const app = new App();
	const stackBuilder = new StackBuilder(app, 'stack');
	const vpc = createVpc(stackBuilder);
	createRds(stackBuilder, vpc);
	createRedis(stackBuilder, vpc);
	createECSCluster(stackBuilder, vpc);

	return stackBuilder.stack;
}

function createVpc(stackBuilder: StackBuilder) {
	const vpc = stackBuilder.vpc('vpc', {
		maxAzs: 2,
		cidr: '10.0.0.0/16',
		natGateways: 0,
	});

	const natSecurityGroup = stackBuilder.securityGroup('natSecurityGroup', {
		vpc: vpc,
		description: 'NAT Instance Security Group',
		allowAllOutbound: true,
	});

	natSecurityGroup.connections.allowFromAnyIpv4(Port.allTcp());

	const natInstance = stackBuilder.ec2('NATInstance', {
		keyName: 'sw-ec2-key',
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
	return vpc;
}

function createRds(stackBuilder: StackBuilder, vpc: Vpc) {
	const rds = stackBuilder.rds('rds', {
		engine: DatabaseInstanceEngine.POSTGRES,
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

	cluster.addAutoScalingGroup(autoScalingGroup, {
		spotInstanceDraining: false,
		taskDrainTime: Duration.seconds(0),
	});

	const stellaTask = createStellaECSTask(stackBuilder);

	stackBuilder.ecsService('scyllaService', {
		cluster,
		taskDefinition: stellaTask,
	});
}

function createStellaECSTask(stackBuilder: StackBuilder) {
	const taskDefinition = stackBuilder.ecsTask('ecsScyllaTask', {
		compatibility: Compatibility.EC2,
		memoryMiB: '512',
		cpu: '256',
		networkMode: NetworkMode.BRIDGE,
	});

	const scyllaContainer = taskDefinition.addContainer('scyllaContainer', {
		image: ContainerImage.fromRegistry('wildcat/scylla'),
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
