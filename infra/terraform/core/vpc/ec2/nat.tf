resource "aws_key_pair" "ec2_key_pair" {
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC0+kKUyx/Ev/hqM9UwLJrQcbP5EtWtQ9CPrfPKSEATdYp1Xe7se+zGvWBUJaBOuv/s72IeJGj3Psgt0id3MNSPUzPdYje41dP9EUeDwEK9fXKBZ7ojRn0yWq6T3S3fTKPxegf29JU7p0MTUStEy5iy8VZSGGhcmyblhdN/Jasa8e7pjvAw75FySeBTkZxS98CnASdG0FbtzCUQ6Wd2K+P37czW9rPRpOU7Z/u4c0NkPyD6BWCTl8jiCVGbU1vkkN5jzjwmtq6q/mkNxHRTAQikJViRHxEgj5HIqk9hRCMNI5UB5mG/O6N074gMmq/2ARO0RTOFxxjcgUWxofP+k8p5 tuannguyen@vdtn359.local"
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
    cidr_blocks = [
      "0.0.0.0/0"]
  }

  ingress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = [
      var.vpc_cidr_block
    ]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = [
      "0.0.0.0/0"]
  }
  vpc_id = var.vpc_id
  tags = var.tags
  name = "sw-nat-security-group"
}

resource "aws_instance" "nat_instance" {
  ami = "ami-00c1445796bc0a29f"
  instance_type = "t2.nano"
  source_dest_check = false
  depends_on = [
    aws_key_pair.ec2_key_pair]
  tags = merge(var.tags, {
    "Name" = "sw-ec2-nat"
  })
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
  subnet_id = var.public_subnet_id
  vpc_security_group_ids = [
    aws_security_group.nat_security_group.id]
  key_name = aws_key_pair.ec2_key_pair.key_name
  iam_instance_profile = aws_iam_instance_profile.nat_instance_profile.id
}

resource "aws_iam_instance_profile" "nat_instance_profile" {
  name = "sw-nat-instance-profile"
  role = aws_iam_role.nat_role.name
}

data "aws_iam_policy" "s3_readonly_policy" {
  arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

data "aws_iam_policy" "ssm_readonly_policy" {
  arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "s3_readonly_policy_attachment" {
  role = aws_iam_role.nat_role.id
  policy_arn = data.aws_iam_policy.s3_readonly_policy.arn
}

resource "aws_iam_role_policy_attachment" "ssm_readonly_policy_attachment" {
  role = aws_iam_role.nat_role.id
  policy_arn = data.aws_iam_policy.ssm_readonly_policy.arn
}

resource "aws_iam_role" "nat_role" {
  name = "sw-nat-role"
  path = "/"
  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
}

resource "aws_eip_association" "nat_eip_association" {
  instance_id = aws_instance.nat_instance.id
  allocation_id = aws_eip.nat_eip.id
}
