import { App, Fn, SecretValue } from '@aws-cdk/core';
import {
	CfnRoute,
	InstanceClass,
	InstanceSize,
	InstanceType,
	Port,
	SecurityGroup,
	SubnetType,
	Vpc,
} from '@aws-cdk/aws-ec2';
import { DatabaseInstanceEngine } from '@aws-cdk/aws-rds';
import { createConfig } from '@shared/lib/config/config-reader';
import { StackBuilder } from '@root/packages/sw-infra/lib/helper/stack-builder';

const config = createConfig(require('./config').config, process.env.NODE_ENV || 'production');

export async function buildSwStack() {
	const app = new App();
	const stackBuilder = new StackBuilder(app, 'stack');
	const vpc = createVpc(stackBuilder);
	createRds(stackBuilder, vpc);
	createRedis(stackBuilder, vpc);

	return stackBuilder.stack;
}

function createVpc(stackBuilder: StackBuilder) {
	const vpc = stackBuilder.vpc('vpc', {
		maxAzs: 2,
		cidr: '10.0.0.0/16',
		natGateways: 0,
	});

	const excludeCondition = stackBuilder.cfnCondition('excludeDefaultRouteSubnet', {
		// Checks if true == false, so this always fails
		expression: Fn.conditionEquals(true, false),
	});

	for (const subnet of vpc.privateSubnets) {
		for (const child of subnet.node.children) {
			if (child.constructor.name === 'CfnRoute') {
				(child as any).cfnOptions.condition = excludeCondition;
			}
		}
	}

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
		defaultRoute.addPropertyOverride('instanceId', natInstance.ref);
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
