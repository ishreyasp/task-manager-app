# Generate a new private key
resource "tls_private_key" "this" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Create AWS key pair using the generated public key
resource "aws_key_pair" "this" {
  key_name   = "my-windows-key-pair"
  public_key = tls_private_key.this.public_key_openssh
}

# Save private key to local file
resource "local_file" "private_key" {
  content  = tls_private_key.this.private_key_pem
  filename = "${path.module}/my-windows-key-pair.pem"
}

# Create an EC2 instance for the backend
resource "aws_instance" "backend" {
  ami                    = var.ami_id
  instance_type          = var.ec2_instance_type
  key_name               = aws_key_pair.this.key_name
  subnet_id              = aws_subnet.public_subnet[0].id
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
    
    # Update the system
    sudo apt-get update -y
    sudo apt-get upgrade -y

    # Install Node.js and npm
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install PM2 globally
    sudo npm install -g pm2

    # Install PostgreSQL
    sudo apt-get install -y postgresql postgresql-contrib

    # Configure PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Find PostgreSQL version
    PG_VERSION=$(ls /etc/postgresql/)
    echo "PostgreSQL version: $PG_VERSION"
    
    # Configure PostgreSQL authentication
    sudo sed -i '/^host/s/ident/md5/' /etc/postgresql/$PG_VERSION/main/pg_hba.conf
    sudo sed -i '/^local/s/peer/trust/' /etc/postgresql/$PG_VERSION/main/pg_hba.conf
    echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/$PG_VERSION/main/pg_hba.conf
    
    # Edit postgresql.conf to listen on all addresses
    sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf
    
    # Restart PostgreSQL to apply changes
    sudo systemctl restart postgresql

    # Setup database (create db user if not exists, then alter, then create database)
    # Since you're using the postgres user, we'll just set the password
    sudo -u postgres psql -c "ALTER USER ${var.db_username} WITH PASSWORD '${var.db_password}';"
    
    # Check if database exists before creating
    DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${var.db_name}'")
    if [ -z "$DB_EXISTS" ]; then
      echo "Creating database ${var.db_name}"
      sudo -u postgres psql -c "CREATE DATABASE \"${var.db_name}\";"
    else
      echo "Database ${var.db_name} already exists"
    fi
    
    # Ensure app user has appropriate permissions
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"${var.db_name}\" TO ${var.db_username};"

    # Create app user and group
    sudo groupadd taskmanagerapp || echo "Group already exists"
    sudo useradd --no-create-home --shell /usr/sbin/nologin --gid taskmanagerapp taskmanagerapp || echo "User already exists"

    # Create app directory
    sudo mkdir -p /opt/task-manager-app/backend

    # Create .env file with database credentials
    sudo cat > /opt/task-manager-app/backend/.env << ENVEOF
    DB_NAME=${var.db_name}
    DB_USERNAME=${var.db_username}
    DB_PASSWORD=${var.db_password}
    DB_HOST=localhost
    DB_DIALECT=postgres
    DB_PORT=5432
    PORT=4000
    ENVEOF

    # Set proper permissions
    sudo chown -R taskmanagerapp:taskmanagerapp /opt/task-manager-app
    sudo chmod -R 750 /opt/task-manager-app
    sudo chmod 600 /opt/task-manager-app/backend/.env
    
    # Log completion for debugging
    echo "User data script completed successfully"
  EOF

  tags = {
    Name = "task-manager-app"
  }
}