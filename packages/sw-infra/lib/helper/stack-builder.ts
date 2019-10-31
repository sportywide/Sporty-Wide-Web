import { Construct, Resource, Stack } from '@aws-cdk/core';
import { SubnetConfiguration, Vpc, VpcProps, SecurityGroup, SecurityGroupProps, Port, IPeer } from '@aws-cdk/aws-ec2';
import { ucfirst } from '@shared/lib/utils/string/conversion';
import { DatabaseInstanceProps, DatabaseInstance } from '@aws-cdk/aws-rds';

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
	private readonly stack: Stack;
	private readonly resourceMap: Map<string, Construct>;

	constructor(scope: Construct, id: string, props?: any) {
		this.stack = new Stack(scope, id, props);
		this.resourceMap = new Map<string, Resource>();
		this.resourceMap.set(id, this.stack);
	}

	vpc(name, props: VpcProps): Vpc {
		return new Vpc(this.stack, this.getName(name), props);
	}

	securityGroup(name, { ingressRules = [], egressRules = [], ...props }: SwSecurityGroupProps): SecurityGroup {
		const securityGroup = new SecurityGroup(this.stack, this.getName(name), props);
		for (const rule of ingressRules) {
			securityGroup.addIngressRule(rule.peer, rule.port);
		}
		for (const rule of egressRules) {
			securityGroup.addEgressRule(rule.peer, rule.port);
		}
		return securityGroup;
	}

	rds(name, props: DatabaseInstanceProps) {
		return new DatabaseInstance(this.stack, this.getName(name), props);
	}

	subnet(props: SubnetConfiguration): SubnetConfiguration {
		return {
			subnetType: props.subnetType,
			name: this.getName(props.name),
			cidrMask: props.cidrMask,
			reserved: props.reserved,
		};
	}

	build() {
		return this.stack;
	}

	get(name) {
		return this.resourceMap.get(this.getName(name));
	}

	private getName(name) {
		return `sw${ucfirst(name)}`;
	}
}
