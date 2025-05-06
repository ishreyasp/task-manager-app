# Create a Private Subnets
resource "aws_subnet" "private_subnet" {
  count             = var.private_subnet_count
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "task-manager-app-private-subnet-${count.index + 1}"
  }
}