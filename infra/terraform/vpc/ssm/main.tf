resource "aws_ssm_parameter" "rds_password_parameter" {
  name = "/sw/rds/password"
  type = "SecureString"
  value = var.db_password
}

resource "aws_ssm_parameter" "rds_username_parameter" {
  name = "/sw/rds/username"
  type = "String"
  value = var.db_username
}

resource "aws_ssm_parameter" "rds_endpoint_parameter" {
  name = "/sw/rds/endpoint"
  type = "String"
  value = var.db_endpoint
}
