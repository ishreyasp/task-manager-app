# Create an Application Load Balancer for the web application
resource "aws_lb" "alb" {
  name               = "task-manager-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = [for subnet in aws_subnet.public_subnet : subnet.id]

  tags = {
    Name = "task-manager-alb"
  }
}

# Create a Target Group for the web application instances
resource "aws_lb_target_group" "tg" {
  name     = "task-manager-tg"
  port     = var.app_port
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id

  health_check {
    path                = var.alb_health_check_path
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 90
    timeout             = 2
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Register the EC2 instance with the target group
resource "aws_lb_target_group_attachment" "backend" {
  target_group_arn = aws_lb_target_group.tg.arn
  target_id        = aws_instance.backend.id
  port             = var.app_port
}

# Create a listener for the Application Load Balancer to forward HTTP traffic to the target group
resource "aws_lb_listener" "webapp_listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-2016-08"
  certificate_arn = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg.arn
  }
}
	