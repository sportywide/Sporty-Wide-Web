resource "aws_iam_instance_profile" "sw_beanstalk_ec2_instance_profile" {
  name = "sw-beanstalk-ec2-instance-profile"
  role = aws_iam_role.sw_beanstalk_ec2_role.name
}

resource "aws_iam_role" "sw_beanstalk_ec2_role" {
  name = "sw-beanstalk-ec2-role"
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

module "elastic_beanstalk_application" {
  source      = "git::https://github.com/cloudposse/terraform-aws-elastic-beanstalk-application.git?ref=tags/0.3.0"
  name        = "sportywide"
  description = "Sportywide application"
}

module "elastic_beanstalk_environment" {
  source                             = "git::https://github.com/cloudposse/terraform-aws-elastic-beanstalk-environment.git?ref=master"
  name                               = "sportywide-prod"
  region                             = "ap-southeast-2"
  availability_zone_selector         = "Any 2"
  elastic_beanstalk_application_name = module.elastic_beanstalk_application.elastic_beanstalk_application_name

  instance_type           = "t2.micro"
  autoscale_min           = 1
  autoscale_max           = 2
  updating_min_in_service = 0
  updating_max_batch      = 1

  loadbalancer_type       = "application"
  vpc_id                  = var.vpc_id
  loadbalancer_subnets    = var.public_subnet_ids
  application_subnets     = var.private_subnet_ids
  allowed_security_groups = [var.security_group_id]
  associate_public_ip_address = true
  elb_scheme = "internet-facing"

  solution_stack_name = "64bit Amazon Linux 2018.03 v2.12.17 running Docker 18.06.1-ce"

  env_vars = {
    SW_FACEBOOK_CLIENT_SECRET: var.env_vars.facebook_client_secret
    SW_GOOGLE_CLIENT_SECRET: var.env_vars.google_client_secret
    SW_JWT_SECRET: var.env_vars.jwt_secret
    SW_COOKIE_SECRET: var.env_vars.cookie_secret
    SW_POSTGRES_USER: var.env_vars.postgres_username
    SW_POSTGRES_PASSWORD: var.env_vars.postgres_password
    SW_POSTGRES_DB: var.env_vars.postgres_db
    SW_MONGO_USER: var.env_vars.mongo_username
    SW_MONGO_PASSWORD: var.env_vars.mongo_password
    SW_MONGO_DB: var.env_vars.mongo_db
  }
}
