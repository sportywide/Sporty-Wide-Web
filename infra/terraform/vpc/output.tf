output "nat_instance_dns" {
  value = aws_instance.nat_instance.public_dns
}
