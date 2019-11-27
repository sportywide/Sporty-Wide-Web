resource "aws_vpc" "vpc" {
  cidr_block = "172.16.0.0/16"
  enable_dns_support = "true"
  enable_dns_hostnames = "true"
  instance_tenancy = "default"
  tags = merge(var.tags, { "Name" = "sw-vpc" })
}

resource "aws_key_pair" "ec2_key_pair" {
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC6fZ1R1aGn4gYQCQlSSM0BlQQHEeqHkozK3qvVAOCtr64wJ7L0e6PZQ26PPx8tk/SJafpM+FfFbaNfdcNLIBmkDWjYFeHFJGMHi6RvYwe4Is4807Nrixf9v2FBiKQ4XImhL5TXLAeXKKh47Yq/xS1nb/VMFAfPDzWVvWK9TiLnCnza5pDr10HO2pPrCbjlnGu/u1v3tG/YsuxtyAh9PXbDAwUlfZqbvvJB5CAnk/ptJj7q8Le24svbeCj0ZyHWIiyfmciUg27oskcBYleoLMIhSGR5YEqwOIKTW70w2YnVTNiaB9VgtusUmglUkgklKsc1NmgPQULRldAH7eUxolJTVAON2GT1b8s9X5Ljcuh2NVfiV6//XaXK+FnPxoGY5S/jOZzan+ilwtRCpyb3tSQFwBa8mTOygQocyrojdynmKzd9GemTzYHi5C5Y0RPV/Eb+ZTpotdbeGP0YdGcIbciEvEhLFI6m/cXQprcUCw21FSC2/nV2Qw8fpvUPjfIYYQABcxKZFyAXLg+ay/ECt7OnTt9YHPaVLvWm1TUPlwvRyQeGlTCPyS7sSis5ReB35jUbAynVMdoBu2FY3eWbS888QmOpIUjM+2A03zgowgOcEQ9froezQSCrW/8ceNBA6VWkGP2R/eFXpjdHoTUPyPtl1/IMxINdk9zuQpVmKSdeFw== tuannguyen@NASQL10657"
  key_name = "sw-ec2-key"
}

resource "aws_eip" "nat_eip" {
  tags = var.tags
}

resource "aws_security_group" "nat_security_group" {
  ingress {
    from_port = 22
    protocol = "TCP"
    to_port = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
  vpc_id = aws_vpc.vpc.id
  tags = var.tags
  name = "sw-nat-security-group"
}

resource "aws_instance" "nat_instance" {
  ami = "ami-00c1445796bc0a29f"
  instance_type = "t2.nano"
  depends_on = [aws_key_pair.ec2_key_pair]
  tags = merge(var.tags, { "Name" = "sw-ec2-nat" })
  volume_tags = var.tags
  user_data = <<EOF
Content-Type: multipart/mixed; boundary="//"
MIME-Version: 1.0

--//
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"

#cloud-config
cloud_final_modules:
- [scripts-user, always]

--//
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"

#!/bin/bash
set -x
exec > >(tee /var/log/user-data.log|logger -t user-data ) 2>&1
yum update -y
yum install -y postgresql
yum install -y gcc
yum install -y git
wget http://download.redis.io/redis-stable.tar.gz && tar xvzf redis-stable.tar.gz && cd redis-stable && make
cp src/redis-cli /usr/bin/
yum install -y jq
yum install -y docker
service docker start
usermod -aG docker ec2-user
--//
EOF
  subnet_id = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.nat_security_group.id]
  monitoring = true
  key_name = aws_key_pair.ec2_key_pair.key_name
  lifecycle {
    ignore_changes = [user_data]
  }
}

resource "aws_eip_association" "nat_eip_association" {
  instance_id = aws_instance.nat_instance.id
  allocation_id = aws_eip.nat_eip.id
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
    instance_id = aws_instance.nat_instance.id
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

module "rds" {
  source = "./rds"
  tags = var.tags
  db_password = var.db_password
  db_username = var.db_username
  private_subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
  vpc_id = aws_vpc.vpc.id
  nat_security_group_id = aws_security_group.nat_security_group.id
}

module "redis" {
  source = "./redis"
  tags = var.tags
  private_subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
  vpc_id = aws_vpc.vpc.id
  nat_security_group_id = aws_security_group.nat_security_group.id
}
