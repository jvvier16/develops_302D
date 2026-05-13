terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
        version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

#ECR: necesitamos 2 elementos en ECR
resource "aws_ecr_repository" "backend" {
  name = "${var.nombre_proyecto}-backend"
  force_delete = true
}
resource "aws_ecr_repository" "frontend" {
  name = "${var.nombre_proyecto}-frontend"
  force_delete = true
}