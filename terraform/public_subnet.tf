# Create a Public Subnets
resource "aws_subnet" "public_subnet" {
  count                   = var.public_subnet_count
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "task-manager-app-public-subnet-${count.index + 1}"
  }
}