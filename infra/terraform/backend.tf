terraform {
  backend "s3" {
    encrypt = true
    bucket = "sportywide-terraform-state"
    key = "sportywide"
    workspace_key_prefix = "workspace"
  }
}
