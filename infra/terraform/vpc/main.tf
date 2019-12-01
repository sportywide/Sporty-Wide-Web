resource "aws_vpc" "vpc" {
  cidr_block = "172.16.0.0/16"
  enable_dns_support = "true"
  enable_dns_hostnames = "true"
  instance_tenancy = "default"
  tags = merge(var.tags, { "Name" = "sw-vpc" })
}

resource "aws_subnet" "public_subnet" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "172.16.0.0/24"
  map_public_ip_on_launch = "true"
  availability_zone = "ap-southeast-2a"
  tags = merge(var.tags, { "Name" = "sw-public-subnet" })
}

resource "aws_internet_gateway" "ip_gateway" {
  vpc_id = aws_vpc.vpc.id
  tags = var.tags
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ip_gateway.id
  }

  tags = var.tags
}

resource "aws_route_table_association" "public_subnet_route_association" {
  subnet_id = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "172.16.1.0/24"
  map_public_ip_on_launch = "false"
  availability_zone = "ap-southeast-2b"
  tags = merge(var.tags, { "Name" = "sw-private-subnet-1" })
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "172.16.2.0/24"
  map_public_ip_on_launch = "false"
  availability_zone = "ap-southeast-2c"
  tags = merge(var.tags, { "Name" = "sw-private-subnet-2" })
}

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    instance_id = module.ec2.nat_instance_id
  }

  tags = var.tags
}

resource "aws_route_table_association" "private_subnet_1_route_association" {
  subnet_id = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "private_subnet_2_route_association" {
  subnet_id = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_security_group" "lambda_security_group" {
  ingress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = [aws_vpc.vpc.cidr_block]
  }

  egress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  vpc_id = aws_vpc.vpc.id
  tags = var.tags
  name = "sw-lambda-security-group"
}

module "rds" {
  source = "./rds"
  tags = var.tags
  db_password = var.db_password
  db_username = var.db_username
  private_subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
  vpc_id = aws_vpc.vpc.id
  nat_security_group_id = module.ec2.nat_security_group_id
  lambda_security_group_id = aws_security_group.lambda_security_group.id
}

module "redis" {
  source = "./redis"
  tags = var.tags
  private_subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
  vpc_id = aws_vpc.vpc.id
  nat_security_group_id = module.ec2.nat_security_group_id
  lambda_security_group_id = aws_security_group.lambda_security_group.id
}

module "ec2" {
  source = "./ec2"
  public_subnet_id = aws_subnet.public_subnet.id
  tags = var.tags
  vpc_id = aws_vpc.vpc.id
  vpc_cidr_block = aws_vpc.vpc.cidr_block
}

module "ssm" {
  source = "./ssm"
  db_password = var.db_password
  db_username = var.db_username
  db_endpoint = module.rds.rds_dns
}

module "scripts" {
  source = "./scripts"
  nat_dns = module.ec2.nat_instance_dns
  rds_dns = module.rds.rds_dns
}
