resource "aws_key_pair" "ec2_key_pair" {
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC6fZ1R1aGn4gYQCQlSSM0BlQQHEeqHkozK3qvVAOCtr64wJ7L0e6PZQ26PPx8tk/SJafpM+FfFbaNfdcNLIBmkDWjYFeHFJGMHi6RvYwe4Is4807Nrixf9v2FBiKQ4XImhL5TXLAeXKKh47Yq/xS1nb/VMFAfPDzWVvWK9TiLnCnza5pDr10HO2pPrCbjlnGu/u1v3tG/YsuxtyAh9PXbDAwUlfZqbvvJB5CAnk/ptJj7q8Le24svbeCj0ZyHWIiyfmciUg27oskcBYleoLMIhSGR5YEqwOIKTW70w2YnVTNiaB9VgtusUmglUkgklKsc1NmgPQULRldAH7eUxolJTVAON2GT1b8s9X5Ljcuh2NVfiV6//XaXK+FnPxoGY5S/jOZzan+ilwtRCpyb3tSQFwBa8mTOygQocyrojdynmKzd9GemTzYHi5C5Y0RPV/Eb+ZTpotdbeGP0YdGcIbciEvEhLFI6m/cXQprcUCw21FSC2/nV2Qw8fpvUPjfIYYQABcxKZFyAXLg+ay/ECt7OnTt9YHPaVLvWm1TUPlwvRyQeGlTCPyS7sSis5ReB35jUbAynVMdoBu2FY3eWbS888QmOpIUjM+2A03zgowgOcEQ9froezQSCrW/8ceNBA6VWkGP2R/eFXpjdHoTUPyPtl1/IMxINdk9zuQpVmKSdeFw== tuannguyen@NASQL10657"
  key_name = "sw-ec2-key"
}

resource "aws_eip" "nat_eip" {
  tags = var.tags
}

resource "aws_security_group" "nat_security_group" {
  ingress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = [
      "0.0.0.0/0"]
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
