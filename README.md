# Terraform AWS Infrastructure

## Descripción

Este proyecto gestiona una infraestructura AWS con Terraform para desplegar una arquitectura de tres capas.

La configuración crea:

- Una VPC con un rango `10.0.0.0/16`.
- Una subred pública para el frontend.
- Una subred privada para backend y base de datos.
- Internet Gateway y tablas de ruta públicas.
- NAT Gateway para tráfico saliente desde la subred privada.
- Grupos de seguridad que restringen el acceso entre frontend, backend y base de datos.
- Un Launch Template para instancias EC2 con Amazon Linux 2, Docker y Git.
- Tres instancias EC2: `frontend`, `backend` y `database`.

## Estructura del proyecto

```
./
├── main.tf
├── README.md
```

> El proyecto actual reside en la raíz del repositorio y utiliza un único archivo Terraform.

## Requisitos

- Terraform CLI versión >= 1.0.
- Credenciales AWS configuradas en el entorno o en el perfil de AWS CLI.
- Cuenta AWS con permisos para crear VPC, subnets, EC2, NAT Gateway, Route Tables, Security Groups y Elastic IP.
- Provider `aws` versión `~> 5.0`.

## Flujo de uso

1. Configura tus credenciales AWS:

```bash
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="us-east-1"
```

2. Inicializa Terraform:

```bash
terraform init
```

3. Revisa el plan de despliegue:

```bash
terraform plan
```

4. Aplica los cambios:

```bash
terraform apply
```

5. (Opcional) Elimina los recursos cuando ya no los necesites:

```bash
terraform destroy
```

## ¿Qué despliega este proyecto?

- `aws_vpc.main`: VPC principal.
- `aws_subnet.public` y `aws_subnet.private`: subredes pública y privada.
- `aws_internet_gateway.igw`: puerta de enlace de Internet.
- `aws_route_table.public_rt`: ruta pública hacia Internet.
- `aws_nat_gateway.nat`: NAT Gateway para salida de la subred privada.
- `aws_route_table.private_rt`: ruta privada hacia la NAT Gateway.
- `aws_security_group.front_sg`: permite HTTP y SSH desde Internet.
- `aws_security_group.back_sg`: permite tráfico del frontend en el puerto 5000.
- `aws_security_group.data_sg`: permite tráfico MySQL (`3306`) solo desde el backend.
- `aws_launch_template.template`: plantilla de lanzamiento con Amazon Linux 2 y user data.
- `aws_instance.frontend`, `aws_instance.backend`, `aws_instance.database`: instancias EC2 para cada capa.

## Mejores prácticas incluidas

- Infraestructura declarativa con Terraform HCL.
- Uso de variables para `region`, `instance_type` y `ami`.
- Separación de subredes pública y privada para mejorar la seguridad.
- Grupos de seguridad por capa para limitar el tráfico entre tiers.
- Plantilla de lanzamiento reutilizable para instancias EC2.
- Automatización de configuración inicial con user data.

## Cómo extender este proyecto

- Extraer recursos en módulos separados (`network`, `compute`, `database`).
- Añadir outputs para IDs de recursos y direcciones IP.
- Parametrizar el número de instancias y los rangos de CIDR.
- Integrar un balanceador de carga para el frontend.
- Sustituir instancias de base de datos por un servicio gestionado como RDS.
- Configurar un backend remoto para el estado de Terraform.
- Añadir un pipeline de CI/CD con GitHub Actions o AWS CodePipeline.
