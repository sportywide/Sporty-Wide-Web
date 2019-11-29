output "nat_instance_dns" {
  value = module.ec2.nat_instance_dns
}

output "rds_dns" {
  value = module.rds.rds_dns
}
