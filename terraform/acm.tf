# Generate a private key for the self-signed certificate
resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

# Create a self-signed certificate
resource "tls_self_signed_cert" "example" {
  private_key_pem = tls_private_key.example.private_key_pem

  subject {
    common_name  = aws_lb.alb.dns_name  
    organization = "Example Organization"
  }

  validity_period_hours = 8760 

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}

# Upload the self-signed certificate to ACM
resource "aws_acm_certificate" "cert" {
  private_key      = tls_private_key.example.private_key_pem
  certificate_body = tls_self_signed_cert.example.cert_pem

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "alb-self-signed-cert"
  }
}