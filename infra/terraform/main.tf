locals {
  common_tags = {
    App = "Sportywide"
    Environment = "production"
  }
}

provider "aws" {
  region = "ap-southeast-2"
}

module "s3" {
  tags = local.common_tags
  source = "./s3"
}

module "vpc" {
  tags = local.common_tags
  source = "./vpc"
  db_password = var.db_password
  db_username = var.db_username
}
