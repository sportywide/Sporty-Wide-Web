module "path_hash" {
  source = "github.com/claranet/terraform-path-hash?ref=v0.1.0"
  path   = "${path.module}/files"
}

resource "null_resource" "update_nat" {
  depends_on = [
    var.nat_dns
  ]
  triggers = {
    run_on_change = module.path_hash.result
  }
  provisioner "remote-exec" {
    inline = [
      "aws s3 cp s3://sw-infra-bucket/ssh_keys/sw_git ~/.ssh/sw_git",
      "chmod 400 ~/.ssh/sw_git",
      "mkdir -p ~/scripts"
    ]
  }
  provisioner "file" {
    source = "${path.module}/files/"
    destination = "~/scripts"
  }
  connection {
    type = "ssh"
    host = var.nat_dns
    user = "ec2-user"
    private_key = file("~/.ssh/sw_ec2_key")
  }
}

resource "null_resource" "db_update" {
  depends_on = [
    null_resource.update_nat,
    var.rds_dns
  ]
  triggers = {
    always_run = timestamp()
  }
  provisioner "remote-exec" {
    inline = [
      "chmod a+x ./scripts/db_update.sh",
      "./scripts/db_update.sh"
    ]
  }
  connection {
    type = "ssh"
    host = var.nat_dns
    user = "ec2-user"
    private_key = file("~/.ssh/sw_ec2_key")
  }
}
