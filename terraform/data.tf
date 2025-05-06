# Available availability zones in a region
data "aws_availability_zones" "available" {
  state = var.az_state
}

output "ec2_public_ip" {
  value       = aws_instance.backend.public_ip
  description = "The public IP address of the EC2 instance"
}

output "ec2_public_dns" {
  value       = aws_instance.backend.public_dns
  description = "The public DNS of the EC2 instance"
}

output "alb_dns_name" {
  value       = "https://${aws_lb.alb.dns_name}"
  description = "The DNS name of the load balancer to use in Vercel environment variables"
}

output "database_connection_string" {
  value       = "postgres://${var.db_username}:${var.db_password}@localhost:5432/${var.db_name}"
  description = "The PostgreSQL connection string (from within EC2)"
  sensitive   = true
}