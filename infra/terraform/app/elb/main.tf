module "elastic_beanstalk_application" {
  source = "git::https://github.com/cloudposse/terraform-aws-elastic-beanstalk-application.git?ref=tags/0.3.0"
  name = "sportywide"
  description = "Sportywide application"
  tags = var.common_tags
}

module "elastic_beanstalk_environment_frontend" {
  source = "git::https://github.com/vdtn359/terraform-aws-elastic-beanstalk-environment.git?ref=master"
  name = "sw-frontend-prod"
  region = "ap-southeast-2"
  tags = var.common_tags
  availability_zone_selector = "Any 2"
  elastic_beanstalk_application_name = module.elastic_beanstalk_application.elastic_beanstalk_application_name

  instance_type = "t2.micro"
  autoscale_min = 1
  autoscale_max = 2
  updating_min_in_service = 0
  updating_max_batch = 1

  loadbalancer_type = "application"
  vpc_id = var.vpc_id
  healthcheck_url = "/healthcheck"
  loadbalancer_subnets = var.public_subnet_ids
  application_subnets = var.public_subnet_ids
  loadbalancer_security_groups = [
    var.security_group_id]
  launch_configuration_security_group_id = var.security_group_id
  associate_public_ip_address = true
  elb_scheme = "internet-facing"
  ssh_listener_port = 22
  ssh_listener_enabled = true
  application_port = 80
  keypair = "sw-ec2-key"

  solution_stack_name = "64bit Amazon Linux 2018.03 v2.14.0 running Docker 18.09.9-ce"

  env_vars = {
    SW_COOKIE_SECRET: var.env_vars.cookie_secret
  }
}

module "elastic_beanstalk_environment_backend" {
  source = "git::https://github.com/vdtn359/terraform-aws-elastic-beanstalk-environment.git?ref=master"
  name = "sw-backend-prod"
  region = "ap-southeast-2"
  tags = var.common_tags
  availability_zone_selector = "Any 2"
  elastic_beanstalk_application_name = module.elastic_beanstalk_application.elastic_beanstalk_application_name

  instance_type = "t2.micro"
  autoscale_min = 1
  autoscale_max = 2
  updating_min_in_service = 0
  updating_max_batch = 1

  loadbalancer_type = "application"
  vpc_id = var.vpc_id
  healthcheck_url = "/hello"
  loadbalancer_subnets = var.public_subnet_ids
  application_subnets = var.public_subnet_ids
  loadbalancer_security_groups = [
    var.security_group_id]
  launch_configuration_security_group_id = var.security_group_id
  associate_public_ip_address = true
  elb_scheme = "internet-facing"
  ssh_listener_port = 22
  ssh_listener_enabled = true
  application_port = 80
  keypair = "sw-ec2-key"

  solution_stack_name = "64bit Amazon Linux 2018.03 v2.18.0 running Multi-container Docker 18.09.9-ce (Generic)"

  env_vars = {
    SW_FACEBOOK_CLIENT_SECRET: var.env_vars.facebook_client_secret
    SW_GOOGLE_CLIENT_SECRET: var.env_vars.google_client_secret
    SW_POSTGRES_USER: var.env_vars.postgres_username
    SW_POSTGRES_PASSWORD: var.env_vars.postgres_password
    SW_POSTGRES_DB: var.env_vars.postgres_db
    SW_MONGO_USER: var.env_vars.mongo_username
    SW_MONGO_PASSWORD: var.env_vars.mongo_password
    SW_MONGO_DB: var.env_vars.mongo_db
    SW_JWT_SECRET: var.env_vars.jwt_secret
    SW_SMTP_USER: var.env_vars.smtp_username
    SW_SMTP_PASSWORD: var.env_vars.smtp_password
    SW_LOGZ_TOKEN: var.env_vars.logz_token
  }
}
