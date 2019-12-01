output "nat_instance_dns" {
  value = module.vpc.nat_instance_dns
}

output "rds_dns" {
  value = module.vpc.rds_dns
}
