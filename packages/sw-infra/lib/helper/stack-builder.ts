import { CfnCondition, CfnConditionProps, Construct, Resource, Stack, Tag } from '@aws-cdk/core';
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
	CfnEIPProps,
	CfnEIP,
} from '@aws-cdk/aws-ec2';
import { Role, RoleProps, CfnInstanceProfileProps, CfnInstanceProfile } from '@aws-cdk/aws-iam';
import { ucfirst } from '@shared/lib/utils/string/conversion';
import { DatabaseInstance, DatabaseInstanceProps } from '@aws-cdk/aws-rds';
import { AutoScalingGroup, AutoScalingGroupProps } from '@aws-cdk/aws-autoscaling';
import {
	Cluster as ECSCluster,
	ClusterProps,
	Ec2ServiceProps,
	TaskDefinitionProps,
	Ec2Service,
	TaskDefinition,
} from '@aws-cdk/aws-ecs';
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

	register<T extends Construct>(name, instance: T): T {
		this.resourceMap.set(this.getName(name), instance);
		return instance;
	}

	vpc(name, props: VpcProps): Vpc {
		return this.register(name, new Vpc(this.stack, this.getName(name), props));
	}

	autoScalingGroup(name, props: AutoScalingGroupProps) {
		return this.register(
			name,
			new AutoScalingGroup(this.stack, this.getName(name), {
				...props,
			})
		);
	}

	eip(name, props?: CfnEIPProps) {
		const eip = new CfnEIP(this.stack, this.getName(name), props);
		Tag.add(eip, 'Reference', 'sw-eip');
		Tag.add(eip, 'Environment', 'production');
		return eip;
	}

	role(name, props: RoleProps) {
		return this.register(
			name,
			new Role(this.stack, this.getName(name), {
				roleName: this.getName(name),
				...props,
			})
		);
	}

	instanceProfile(name, props: CfnInstanceProfileProps) {
		return this.register(
			name,
			new CfnInstanceProfile(this.stack, this.getName(name), {
				instanceProfileName: this.getName(name),
				...props,
			})
		);
	}

	ecs(name, props: ClusterProps) {
		const resourceName = this.getName(name);
		return this.register(
			name,
			new ECSCluster(this.stack, resourceName, {
				clusterName: resourceName,
				...props,
			})
		);
	}

	ecsTask(name, props: TaskDefinitionProps) {
		const resourceName = this.getName(name);
		return this.register(
			name,
			new TaskDefinition(this.stack, resourceName, {
				...props,
			})
		);
	}

	ecsService(name, props: Ec2ServiceProps) {
		const resourceName = this.getName(name);
		return this.register(
			name,
			new Ec2Service(this.stack, resourceName, {
				serviceName: resourceName,
				...props,
			})
		);
	}

	securityGroup(name, { ingressRules = [], egressRules = [], ...props }: SwSecurityGroupProps): SecurityGroup {
		const resourceName = this.getName(name);
		const securityGroup = new SecurityGroup(this.stack, resourceName, {
			securityGroupName: resourceName,
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
		return this.register(
			name,
			new DatabaseInstance(this.stack, this.getName(name), {
				instanceIdentifier: this.getName(name),
				...props,
			})
		);
	}

	cacheSubnetGroup(name, props: CfnSubnetGroupProps) {
		const resourceName = this.getName(name);
		return this.register(
			name,
			new CfnSubnetGroup(this.stack, resourceName, {
				cacheSubnetGroupName: resourceName,
				...props,
			})
		);
	}

	cacheCluster(name, props: CfnCacheClusterProps) {
		const resourceName = this.getName(name);
		return this.register(
			name,
			new CfnCacheCluster(this.stack, resourceName, {
				clusterName: resourceName,
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

	attachRolesToInstance(instanceProfileName, instance: CfnInstance, ...roles: Role[]) {
		const instanceProfile = this.instanceProfile(instanceProfileName, {
			roles: roles.map(role => role.roleName),
		});
		instance.iamInstanceProfile = instanceProfile.ref;
		instance.addDependsOn(instanceProfile);
		return instance;
	}
}
