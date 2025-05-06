# Create a Public Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = var.public_route
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "task-manager-app-public-rtb"
  }
}

# Public Route Table Associations
resource "aws_route_table_association" "public_rt_association" {
  count          = var.public_subnet_count
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_rt.id
}