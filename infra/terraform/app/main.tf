provider "aws" {
  region = "ap-southeast-2"
}

locals {
  common_tags = {
    App = "Sportywide"
    Environment = "production"
  }
}

data "terraform_remote_state" "core" {
  backend = "s3"
  config = {
    bucket = "sportywide-terraform-state"
    key = "core/terraform.tfstate"
    workspace_key_prefix = "workspace"
    region = "ap-southeast-2"
  }
}

module "elb" {
  source = "./elb"
  vpc_id = data.terraform_remote_state.core.outputs.vpc_id
  deployment_bucket_arn = data.terraform_remote_state.core.outputs.deployment_bucket_arn
  private_subnet_ids = data.terraform_remote_state.core.outputs.private_subnet_ids
  public_subnet_ids = data.terraform_remote_state.core.outputs.public_subnet_ids
  security_group_id = data.terraform_remote_state.core.outputs.app_security_group_id
  env_vars = var.env_vars
  common_tags = local.common_tags
}
