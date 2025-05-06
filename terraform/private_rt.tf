# Create a Private Route Table
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "task-manager-app-private-rtb"
  }
}

# Private Route Table Associations
resource "aws_route_table_association" "private_rt_association" {
  count          = var.private_subnet_count
  subnet_id      = aws_subnet.private_subnet[count.index].id
  route_table_id = aws_route_table.private_rt.id
}