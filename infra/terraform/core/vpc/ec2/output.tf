output "nat_instance_id" {
  value = aws_instance.nat_instance.id
}

output "nat_security_group_id" {
  value = aws_security_group.nat_security_group.id
}

output "nat_instance_dns" {
  value = aws_instance.nat_instance.public_dns
}
