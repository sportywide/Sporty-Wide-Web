import { App, SecretValue } from '@aws-cdk/core';
import { InstanceClass, InstanceSize, InstanceType, Peer, Port, SubnetType } from '@aws-cdk/aws-ec2';
import { DatabaseInstanceEngine } from '@aws-cdk/aws-rds';
import { createConfig } from '@shared/lib/config/config-reader';
import { StackBuilder } from '@root/packages/sw-infra/lib/helper/stack-builder';

const config = createConfig(require('./config').config, process.env.NODE_ENV || 'production');

export async function buildSwStack() {
	const app = new App();
	const stackBuilder = new StackBuilder(app, 'stack');
	const vpc = stackBuilder.vpc('vpc', {
		maxAzs: 2,
		cidr: '10.0.0.0/16',
		subnetConfiguration: [
			stackBuilder.subnet({
				cidrMask: 24,
				name: 'publicSubnet',
				subnetType: SubnetType.PUBLIC,
			}),
		],
	});
	const rdsSecurityGroup = stackBuilder.securityGroup('rdsSecurityGroup', {
		allowAllOutbound: true,
		description: `SW Postgres security group`,
		vpc,
		ingressRules: [
			{
				port: Port.tcp(5432),
				peer: Peer.anyIpv4(),
			},
		],
	});

	stackBuilder.rds('rds', {
		engine: DatabaseInstanceEngine.POSTGRES,
		securityGroups: [rdsSecurityGroup],
		vpcPlacement: { subnetType: SubnetType.PUBLIC },
		databaseName: config.get('postgres:database'),
		instanceClass: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
		vpc,
		deleteAutomatedBackups: true,
		deletionProtection: false,
		masterUsername: config.get('postgres:username'),
		masterUserPassword: new SecretValue(config.get('postgres:password')),
	});

	return stackBuilder.build();
}
