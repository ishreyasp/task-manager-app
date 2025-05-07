# Application Security Group
resource "aws_security_group" "app_sg" {
  name        = "application-security-group"
  description = "Security group for task manager application"
  vpc_id      = aws_vpc.vpc.id

  # SSH - only from Load Balancer SG
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_port_cidr
  }

  # Application port
  ingress {
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [aws_security_group.lb_sg.id]
  }

  # Egress rule
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = var.egress_cidr
  }

  tags = {
    Name = "application-security-group"
  }
}
