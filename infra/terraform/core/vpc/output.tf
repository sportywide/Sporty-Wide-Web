output "nat_instance_dns" {
  value = module.ec2.nat_instance_dns
}

output "rds_dns" {
  value = module.rds.rds_dns
}

output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "nat_security_group_id" {
  value = module.ec2.nat_security_group_id
}

output "public_subnet_ids" {
  value = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}

output "private_subnet_ids" {
  value = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}
