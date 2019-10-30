import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import {
	Vpc,
	InstanceClass,
	SubnetType,
	InstanceSize,
	InstanceType,
	SecurityGroup,
	Peer,
	Port,
} from '@aws-cdk/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine } from '@aws-cdk/aws-rds';
import { createConfig } from '@shared/lib/config/config-reader';

const config = createConfig(require('./config').config, process.env.NODE_ENV || 'production');

export class SwInfraStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const vpc = new Vpc(this, 'swVpc');

		const securityGroup = new SecurityGroup(this, 'swRdsSecurityGroup', {
			allowAllOutbound: true,
			description: `SW Postgres security group`,
			vpc,
		});

		securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432));

		new DatabaseInstance(this, 'swRds', {
			engine: DatabaseInstanceEngine.POSTGRES,
			securityGroups: [securityGroup],
			vpcPlacement: { subnetType: SubnetType.PUBLIC },
			databaseName: config.get('postgres:database'),
			instanceClass: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
			vpc,
			masterUsername: config.get('postgres:username'),
			masterUserPassword: new SecretValue(config.get('postgres:password')),
		});
	}
}
