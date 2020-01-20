output "rds_dns" {
  value = aws_db_instance.rds.endpoint
}
