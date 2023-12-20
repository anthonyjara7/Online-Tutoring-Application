terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "app_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_object" "picture_directory" {
  bucket = aws_s3_bucket.app_bucket.id
  key    = "profile_pictures/"
}

resource "aws_db_instance" "default" {
  allocated_storage = 20
  engine            = "mysql"
  engine_version    = "8.0.33"
  instance_class    = "db.t3.micro"
  db_name           = var.db_name
  port              = var.db_port
  username          = var.db_user
  password          = var.db_pass
}

# Removes EC2 instance from GitHub Actions self-hosted runners on termination.
# Note: connection and provisioner blocks can only reference the self object.
# The terraform_data resource places the triggers_replace value on the self object
# so this code is placed separate from the EC2 instance resource
resource "terraform_data" "terminate" {
  # Resource gets destroyed when EC2 public IP changes (in this case, on termination)
  triggers_replace = {
    host       = aws_instance.app_server.public_ip,
    admin_user = var.admin_user,
    key_path   = var.key_path,
  }

  # Need to ssh into EC2 instance for remote-exec to function
  connection {
    type = "ssh"
    # Values accessible in dot notation (triggers_replace.host) or bracket notation (triggers_replace["host"])
    host        = self.triggers_replace.host
    user        = self.triggers_replace.admin_user
    private_key = file(self.triggers_replace.key_path)
  }

  # When this resource is destroyed, upload script to EC2 instance 
  provisioner "remote-exec" {
    when       = destroy
    script     = "./remove_runner.sh"
    on_failure = continue
  }
}

resource "aws_instance" "app_server" {
  ami                  = "ami-0230bd60aa48260c6"
  instance_type        = "t2.micro"
  iam_instance_profile = "OTA-Role"
  key_name             = "tutoring-scheduler"
  security_groups      = ["launch-wizard-4"]

  user_data_replace_on_change = true
  user_data                   = file("./user_data.sh")

  # User data script requires these parameters to be stored first
  # before it can access them
  depends_on = [
    aws_ssm_parameter.ota_db_host,
    aws_ssm_parameter.ota_db_name,
    aws_ssm_parameter.ota_db_port,
    aws_ssm_parameter.ota_db_user,
    aws_ssm_parameter.ota_db_pass,
    aws_ssm_parameter.ota_mfa_email,
    aws_ssm_parameter.ota_mfa_pass,
    aws_ssm_parameter.ota_github_token,
    aws_ssm_parameter.ota_github_owner,
    aws_ssm_parameter.ota_github_repo,
  ]
  tags = {
    Name = "github-runner"
  }
}
