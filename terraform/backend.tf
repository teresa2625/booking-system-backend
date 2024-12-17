terraform {
  backend "s3" {
    bucket         = "bs-terraform-state-bucket"
    key            = "projects/booking-system/terraform.tfstate"
    region         = "ap-southeast-2"
    encrypt        = true
    dynamodb_table = "bs-terraform-lock-table"
  }
}
