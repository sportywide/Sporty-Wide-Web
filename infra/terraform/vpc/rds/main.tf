resource "aws_db_instance" "rds" {
  instance_class = "db.t2.micro"
  engine = "postgres"
  engine_version = "10.10"
  deletion_protection = false
  tags = var.tags
  allocated_storage = 100
  publicly_accessible = false
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  username = var.db_username
  password = var.db_password
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
  name = "swrds"
}

resource "aws_security_group" "rds_security_group" {
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "TCP"
    security_groups = [
      var.nat_security_group_id
    ]
  }
  vpc_id = var.vpc_id
  name = "sw-rds-security-group"
  tags = var.tags
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name = "sw-rds-subnet-group"
  subnet_ids = var.private_subnet_ids
  tags = var.tags
}
