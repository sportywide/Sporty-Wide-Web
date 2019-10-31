import { CfnCondition, CfnConditionProps, Construct, Resource, Stack } from '@aws-cdk/core';
import {
	CfnInstance,
	CfnInstanceProps,
	IPeer,
	Port,
	SecurityGroup,
	SecurityGroupProps,
	SubnetConfiguration,
	Vpc,
	VpcProps,
} from '@aws-cdk/aws-ec2';
import { ucfirst } from '@shared/lib/utils/string/conversion';
import { DatabaseInstance, DatabaseInstanceProps } from '@aws-cdk/aws-rds';
import { CfnCacheCluster, CfnCacheClusterProps, CfnSubnetGroup, CfnSubnetGroupProps } from '@aws-cdk/aws-elasticache';

type SwSecurityGroupProps = SecurityGroupProps & {
	ingressRules?: {
		peer: IPeer;
		port: Port;
	}[];
	egressRules?: {
		peer: IPeer;
		port: Port;
	}[];
};
export class StackBuilder {
	readonly stack: Stack;
	private readonly resourceMap: Map<string, Construct>;
	readonly app: Construct;

	constructor(scope: Construct, id: string, props?: any) {
		this.app = scope;
		this.stack = new Stack(scope, this.getName(id), props);
		this.resourceMap = new Map<string, Resource>();
		this.resourceMap.set(this.getName(id), this.stack);
	}

	cfnCondition(name, props: CfnConditionProps) {
		return this.register(name, new CfnCondition(this.stack, this.getName(name), props));
	}

	register(name, instance) {
		this.resourceMap.set(this.getName(name), instance);
		return instance;
	}

	vpc(name, props: VpcProps): Vpc {
		return this.register(name, new Vpc(this.stack, this.getName(name), props));
	}

	securityGroup(name, { ingressRules = [], egressRules = [], ...props }: SwSecurityGroupProps): SecurityGroup {
		const securityGroup = new SecurityGroup(this.stack, this.getName(name), {
			securityGroupName: this.getName(name),
			...props,
		});
		for (const rule of ingressRules) {
			securityGroup.addIngressRule(rule.peer, rule.port);
		}
		for (const rule of egressRules) {
			securityGroup.addEgressRule(rule.peer, rule.port);
		}
		return this.register(name, securityGroup);
	}

	ec2(name, props: CfnInstanceProps) {
		return this.register(
			name,
			new CfnInstance(this.stack, this.getName(name), {
				...props,
			})
		);
	}

	rds(name, props: DatabaseInstanceProps): DatabaseInstance {
		return this.register(name, new DatabaseInstance(this.stack, this.getName(name), props));
	}

	cacheSubnetGroup(name, props: CfnSubnetGroupProps) {
		return this.register(
			name,
			new CfnSubnetGroup(this.stack, this.getName(name), {
				cacheSubnetGroupName: this.getName(name),
				...props,
			})
		);
	}

	cacheCluster(name, props: CfnCacheClusterProps) {
		return this.register(
			name,
			new CfnCacheCluster(this.stack, this.getName(name), {
				clusterName: this.getName(name),
				...props,
			})
		);
	}

	subnet(props: SubnetConfiguration): SubnetConfiguration {
		return {
			subnetType: props.subnetType,
			name: this.getName(props.name),
			cidrMask: props.cidrMask,
			reserved: props.reserved,
		};
	}

	get(name) {
		return this.resourceMap.get(this.getName(name));
	}

	private getName(name) {
		return `sw${ucfirst(name)}`;
	}
}
