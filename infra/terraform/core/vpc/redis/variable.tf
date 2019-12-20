variable "tags" {
  type = map(string)
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "vpc_id" {}

variable "nat_security_group_id" {}

variable "lambda_security_group_id" {}

variable "app_security_group_id" {}
