# Terraform file to list all input variables to be passed from a .tfvars file.
# Saves information in AWS Systems Mangager parameter store to prevent
# secrets from being stored in artifacts when called in shell scripts.

resource "aws_ssm_parameter" "ota_db_host" {
  name  = "/ota/db/host"
  type  = "String"
  value = aws_db_instance.default.address
}

variable "db_name" {
  type = string
}

resource "aws_ssm_parameter" "ota_db_name" {
  name  = "/ota/db/name"
  type  = "String"
  value = var.db_name
}

variable "db_port" {
  type = number
}

resource "aws_ssm_parameter" "ota_db_port" {
  name  = "/ota/db/port"
  type  = "String"
  value = var.db_port
}

variable "db_user" {
  type = string
}

resource "aws_ssm_parameter" "ota_db_user" {
  name  = "/ota/db/user"
  type  = "String"
  value = var.db_user
}

variable "db_pass" {
  type = string
}

variable "db_snapshot" {
  type = string
}

resource "aws_ssm_parameter" "ota_db_pass" {
  name  = "/ota/db/pass"
  type  = "String"
  value = var.db_pass
}

variable "mfa_email" {
  type = string
}

resource "aws_ssm_parameter" "ota_mfa_email" {
  name  = "/ota/mfa/email"
  type  = "String"
  value = var.mfa_email
}

variable "mfa_pass" {
  type = string
}

resource "aws_ssm_parameter" "ota_mfa_pass" {
  name  = "/ota/mfa/pass"
  type  = "String"
  value = var.mfa_pass
}

variable "github_token" {
  type = string
}

resource "aws_ssm_parameter" "ota_github_token" {
  name  = "/ota/github/token"
  type  = "String"
  value = var.github_token
}

variable "github_owner" {
  type = string
}

resource "aws_ssm_parameter" "ota_github_owner" {
  name  = "/ota/github/owner"
  type  = "String"
  value = var.github_owner
}

variable "github_repo" {
  type = string
}

resource "aws_ssm_parameter" "ota_github_repo" {
  name  = "/ota/github/repo"
  type  = "String"
  value = var.github_repo
}

variable "bucket_name" {
  type = string
}

resource "aws_ssm_parameter" "ota_s3_bucket" {
  name  = "/ota/s3/bucket"
  type  = "String"
  value = aws_s3_bucket.app_bucket.id
}

resource "aws_ssm_parameter" "ota_s3_bucket_domain" {
  name  = "/ota/s3/domain"
  type  = "String"
  value = aws_s3_bucket.app_bucket.bucket_domain_name
}

variable "admin_user" {
  type = string
}

variable "key_path" {
  type = string
}
