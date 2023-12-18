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

resource "terraform_data" "terminate" {
  triggers_replace = [
    aws_instance.app_server.public_ip,
    var.admin_username,
    var.key_path,
    var.github_token,
    var.github_owner,
    var.github_repo,
  ]

  connection {
    type        = "ssh"
    host        = self.triggers_replace[0]
    user        = self.triggers_replace[1]
    private_key = file(self.triggers_replace[2])
  }

  provisioner "file" {
    content = templatefile("./remove_runner.tftpl", {
      github_token = self.triggers_replace[3],
      github_owner = self.triggers_replace[4],
      github_repo  = self.triggers_replace[5],
    })
    destination = "/home/ec2-user/remove_runner.sh"
  }

  provisioner "remote-exec" {
    when = destroy
    inline = [
      "chmod +x remove_runner.sh",
      "~/remove_runner.sh",
    ]
    on_failure = continue
  }
}

resource "aws_instance" "app_server" {
  ami                  = "ami-0230bd60aa48260c6"
  instance_type        = "t2.micro"
  iam_instance_profile = "EC2-S3-RDS"
  key_name             = "tutoring-scheduler"
  security_groups      = ["launch-wizard-4"]

  user_data_replace_on_change = true
  user_data = templatefile("./user_data.tftpl", {
    github_token = var.github_token,
    github_owner = var.github_owner,
    github_repo  = var.github_repo,
    db_host      = aws_db_instance.default.address,
    db_name      = var.db_name,
    db_user      = var.db_user,
    db_pass      = var.db_pass,
    db_port      = var.db_port,
    mfa_email    = var.mfa_email,
    mfa_pass     = var.mfa_pass,
  })

  tags = {
    Name = "github-runner"
  }
}
