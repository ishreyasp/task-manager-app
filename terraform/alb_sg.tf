# Load Balancer Security Group
resource "aws_security_group" "lb_sg" {
  name        = "load-balancer-security-group"
  description = "Allows internet traffic to the Load Balancer"
  vpc_id      = aws_vpc.vpc.id

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.https_port_cidr
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.http_port_cidr
  }

  # Egress - allow all outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = var.egress_cidr
  }

  tags = {
    Name = "load-balancer-security-group"
  }
}
	