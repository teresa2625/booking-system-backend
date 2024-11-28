terraform {
  backend "s3" {
    bucket         = "bs-terraform-state-bucket"                 # Replace with your S3 bucket name
    key            = "projects/booking-system/terraform.tfstate" # Path where the state file will be stored inside the bucket
    region         = "ap-southeast-2"                            # Replace with your AWS region
    encrypt        = true
    dynamodb_table = "bs-terraform-lock-table" # DynamoDB table for state locking
  }
}
