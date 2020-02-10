resource "aws_s3_bucket" "data_bucket" {
	bucket = "sw-data-bucket"
	tags = var.tags
}

resource "aws_s3_bucket" "asset_bucket" {
	bucket = "sw-asset-bucket"
	tags = var.tags
}

resource "aws_s3_bucket_policy" "asset_bucket_policy" {
  bucket = aws_s3_bucket.asset_bucket.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": [ "s3:GetObject" ],
      "Resource": [
        "${aws_s3_bucket.asset_bucket.arn}",
        "${aws_s3_bucket.asset_bucket.arn}/*"
      ]
    }
  ]
}
EOF
}
