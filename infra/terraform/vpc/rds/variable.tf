variable "tags" {
 type = map(string)
}

variable "private_subnet_ids" {
 type = list(string)
}

variable "vpc_id" {}

variable "db_username" {}

variable "db_password" {}

variable "nat_security_group_id" {}

variable "lambda_security_group_id" {}
