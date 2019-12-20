resource "aws_s3_bucket" "data_bucket" {
  bucket = "sw-data-bucket"
  tags = var.tags
}
