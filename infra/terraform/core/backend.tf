terraform {
  backend "s3" {
    encrypt = true
    bucket = "sportywide-terraform-state"
    key = "core/terraform.tfstate"
    workspace_key_prefix = "workspace"
    region = "ap-southeast-2"
  }
}
