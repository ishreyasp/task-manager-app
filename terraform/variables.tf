# Variables for VPC and other resources
variable "region" {
  type        = string
  description = "AWS region"
}

variable "profile" {
  type        = string
  description = "AWS profile"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for VPC"
}

variable "public_subnet_count" {
  type        = number
  description = "Number of public subnets to create"
}

variable "private_subnet_count" {
  type        = number
  description = "Number of public subnets to create"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for public subnets"
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for private subnets"
}

variable "public_route" {
  type        = string
  description = "Public route"
}

variable "az_state" {
  type        = string
  description = "State of availability zones"
}

variable "instance_tenancy" {
  type        = string
  description = "Tenancy of the instance"
  default     = "default"
}

variable "app_port" {
  type        = number
  description = "Custom Application port"
}

variable "ssh_port_cidr" {
  type        = list(string)
  description = "CIDR blocks for SSH access"
}

variable "app_port_cidr" {
  type        = list(string)
  description = "CIDR blocks for HTTP access"
}

variable "egress_cidr" {
  type        = list(string)
  description = "CIDR blocks for egress access"
}

variable "ami_id" {
  type        = string
  description = "Custom AMI ID"
}

variable "ec2_instance_type" {
  type        = string
  description = "EC2 instance type"
}

variable "alb_health_check_path" {
  type        = string
  description = "ALB health check path"
}

variable "db_username" {
  type        = string
  description = "Database username"
}

variable "db_password" {
  type        = string
  description = "Database password"
  sensitive   = true
}

variable "db_name" {
  type        = string
  description = "Database name"
}