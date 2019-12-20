variable "deployment_bucket_arn" {}

variable "vpc_id" {}

variable "private_subnet_ids" {
  type = list(string)
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "security_group_id" {}

variable "env_vars" {
  type = object({
    postgres_username: string,
    postgres_password: string,
    postgres_db: string,
    mongo_username: string,
    mongo_password: string,
    mongo_db: string,
    jwt_secret: string,
    facebook_client_secret: string,
    google_client_secret: string,
    cookie_secret: string,
  })
}
