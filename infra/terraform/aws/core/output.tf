output "nat_instance_dns" {
  value = module.vpc.nat_instance_dns
}

output "rds_dns" {
  value = module.vpc.rds_dns
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "nat_security_group_id" {
  value = module.vpc.nat_security_group_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}

output "deployment_bucket_arn" {
  value = module.s3.deployment_bucket_arn
}

output "app_security_group_id" {
  value = module.vpc.app_security_group_id
}
