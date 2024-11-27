provider "aws" {
  region = "ap-southeast-2" # Adjust to your region
}

# resource "aws_key_pair" "BS_backend_key" {
#   key_name   = "BS-backend-key"  # Replace with the desired name for the key pair
#   public_key = file("C:/Users/teres/.ssh/id_rsa.pub")  # Path to your local public key
# }

# Backend EC2 Instance
resource "aws_instance" "backend" {
  ami           = "ami-033b5193317e5d5cf" # Amazon Linux 2 AMI ID (Replace as needed)
  instance_type = "t2.micro"
  # key_name      = aws_key_pair.BS_backend_key.key_name

  tags = {
    Name = "BS-backend-instance"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              curl -sL https://rpm.nodesource.com/setup_16.x | bash -
              yum install -y nodejs amazon-cloudwatch-agent git
              cd /home/ec2-user
              git clone ${var.backend_repo}
              cd ${var.backend_repo_name}
              export DB_USERNAME="${var.db_username}"
              export DB_PASSWORD="${var.db_password}"
              yarn install
              nohup node index.js &

              # Configure CloudWatch Agent
              cat <<EOT > /opt/aws/amazon-cloudwatch-agent/bin/config.json
              {
                "logs": {
                  "logs_collected": {
                    "files": {
                      "collect_list": [
                        {
                          "file_path": "/home/ec2-user/${var.backend_repo_name}/app.log",
                          "log_group_name": "backend-log-group",
                          "log_stream_name": "backend-log-stream",
                          "timestamp_format": "%Y-%m-%d %H:%M:%S"
                        }
                      ]
                    }
                  }
                }
              }
              EOT
              /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a start -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
              EOF
}

# OIDC provider for GitHub Actions
# resource "aws_iam_openid_connect_provider" "github_oidc_provider" {
#   url = "https://token.actions.githubusercontent.com"

#   client_id_list = [
#     "sts.amazonaws.com"
#   ]

#   thumbprint_list = [
#     "6938fd4d98bab03faadb97b34396831e3780aea1"
#   ]
# }

resource "aws_iam_role" "BS_backend_role" {
  name = "BS-backend-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ec2:RunInstances",
          "ec2:DescribeInstances",
          "ec2:TerminateInstances",
          "ec2:DescribeImages"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:ap-southeast-2:713292987965:log-group:booking-system-backend-log-group*"
      },
      {
        Effect   = "Allow",
        Action   = "iam:CreateRole",
        Resource = "arn:aws:iam::713292987965:role/OIDC_role"
      },
      {
        Effect   = "Allow",
        Action   = "sts:AssumeRole",
        Resource = "arn:aws:iam::713292987965:role/OIDC_role"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_attach" {
  role       = aws_iam_role.BS_backend_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "ec2_permissions_attach" {
  role       = aws_iam_role.BS_backend_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2FullAccess" # Attach EC2 permissions here
}

resource "aws_cloudwatch_log_group" "BS_backend_log_group" {
  name              = "booking-system-backend-log-group"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_metric_filter" "BS_backend_error_filter" {
  name           = "BackendErrorFilter"
  log_group_name = aws_cloudwatch_log_group.BS_backend_log_group.name
  pattern        = "\"ERROR\""

  metric_transformation {
    name      = "BackendErrorCount"
    namespace = "Backend"
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "BS_backend_error_alarm" {
  alarm_name          = "BackendErrorAlarm"
  metric_name         = aws_cloudwatch_log_metric_filter.BS_backend_error_filter.metric_transformation[0].name
  namespace           = "Backend"
  statistic           = "Sum"
  period              = "60"
  evaluation_periods  = "1"
  threshold           = "1"
  comparison_operator = "GreaterThanOrEqualToThreshold"

  alarm_actions = ["arn:aws:sns:ap-southeast-2:${var.aws_account_id}:your-sns-topic"]
}

# Outputs
output "backend_api_url" {
  value = "http://${aws_instance.backend.public_ip}:3000"
}
