terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# -----------------------
# VARIABLES
# -----------------------

variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "ami" {
  description = "Amazon Linux 2"
  default     = "ami-0c02fb55956c7d316"
}

# -----------------------
# VPC
# -----------------------

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "innovatech-vpc"
  }
}

# -----------------------
# SUBNETS
# -----------------------

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "frontend-subnet"
  }
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"

  tags = {
    Name = "backend-data-subnet"
  }
}

# -----------------------
# INTERNET GATEWAY
# -----------------------

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

# -----------------------
# PUBLIC ROUTE TABLE
# -----------------------

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# -----------------------
# NAT GATEWAY
# -----------------------

resource "aws_eip" "nat_ip" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_ip.id
  subnet_id     = aws_subnet.public.id
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}

resource "aws_route_table_association" "private_assoc" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private_rt.id
}

# -----------------------
# SECURITY GROUP FRONT
# -----------------------

resource "aws_security_group" "front_sg" {

  name   = "frontend-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH admin"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {

    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# -----------------------
# SECURITY GROUP BACK
# -----------------------

resource "aws_security_group" "back_sg" {

  name   = "backend-sg"
  vpc_id = aws_vpc.main.id

  ingress {

    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.front_sg.id]
  }

  egress {

    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# -----------------------
# SECURITY GROUP DATA
# -----------------------

resource "aws_security_group" "data_sg" {

  name   = "database-sg"
  vpc_id = aws_vpc.main.id

  ingress {

    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.back_sg.id]
  }

  egress {

    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# -----------------------
# USER DATA (DOCKER + GIT)
# -----------------------

locals {
  docker_install = <<EOF
#!/bin/bash
yum update -y
yum install docker git -y
systemctl start docker
systemctl enable docker
EOF
}

# -----------------------
# LAUNCH TEMPLATE
# -----------------------

resource "aws_launch_template" "template" {

  name_prefix   = "innovatech-template"
  image_id      = var.ami
  instance_type = var.instance_type

  user_data = base64encode(local.docker_install)
}

# -----------------------
# EC2 FRONTEND
# -----------------------

resource "aws_instance" "frontend" {

  launch_template {
    id      = aws_launch_template.template.id
    version = "$Latest"
  }

  subnet_id = aws_subnet.public.id

  vpc_security_group_ids = [
    aws_security_group.front_sg.id
  ]

  tags = {
    Name = "frontend-server"
  }
}

# -----------------------
# EC2 BACKEND
# -----------------------

resource "aws_instance" "backend" {

  launch_template {
    id      = aws_launch_template.template.id
    version = "$Latest"
  }

  subnet_id = aws_subnet.private.id

  vpc_security_group_ids = [
    aws_security_group.back_sg.id
  ]

  tags = {
    Name = "backend-server"
  }
}

# -----------------------
# EC2 DATABASE
# -----------------------

resource "aws_instance" "database" {

  launch_template {
    id      = aws_launch_template.template.id
    version = "$Latest"
  }

  subnet_id = aws_subnet.private.id

  vpc_security_group_ids = [
    aws_security_group.data_sg.id
  ]

  tags = {
    Name = "database-server"
  }
}