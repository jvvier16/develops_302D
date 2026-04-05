# Terraform Azure Infrastructure

## Descripción

Este proyecto gestiona una infraestructura Azure con Terraform para desplegar:

- Dos Virtual Networks, cada una con una subred.
- Una VM Windows en cada subred.
- Azure Bastion para acceso seguro.
- NAT Gateway para tráfico saliente con IP pública estática.
- Peering entre las Virtual Networks.
- Separación de recursos en dos Resource Groups: `network` y `compute`.

## Estructura del proyecto

```
deployment_azure_netwrok_terraform/
├── main.tf
├── providers.tf
├── variables.tf
├── terraform.tfvars
├── outputs.tf
├── modules/
│   ├── network/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   └── compute/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
└── README.md
```

## Requisitos

- Terraform CLI versión >= 1.0.
- Azure CLI (`az`) o autenticación con variables de entorno.
- Suscripción Azure con permisos de `Contributor` u `Owner`.
- Provider `azurerm` versión >= 3.0.

## Flujo de uso

1. Clonar el repositorio.
2. Entrar en la carpeta del proyecto:

```bash
cd deployment_azure_netwrok_terraform
```

3. Inicializar Terraform:

```bash
terraform init
```

4. Verificar el plan:

```bash
terraform plan
```

5. Aplicar los cambios:

```bash
terraform apply
```

## ¿Qué despliega este proyecto?

- Módulo `network`
  - Resource Group de red.
  - Dos Virtual Networks con sus respectivas subredes.
  - NSGs para controlar tráfico de HTTP y acceso RDP protegido.
  - NAT Gateway con IP pública estática para salida segura.
  - Subnet `AzureBastionSubnet` y IP pública para Azure Bastion.
  - Peering bidireccional entre las dos VNets.

- Módulo `compute`
  - Resource Group de cómputo.
  - VMs Windows desplegadas en cada subred.
  - Instalación de IIS en cada VM mediante extensión.
  - Azure Bastion Host configurado para acceder a las VMs de forma segura.

## Mejores prácticas incluidas

- Separación clara de responsabilidades en módulos `network` y `compute`.
- Variables organizadas en el root y en cada módulo.
- Outputs definidos para exponer IDs críticos y datos importantes.
- Tags globales aplicadas a recursos compatibles.
- Uso de recursos administrados en Azure para mantener la infraestructura declarativa.

## Cómo extender este proyecto

- Agregar balanceadores de carga entre las VMs.
- Añadir autoescalado con `Virtual Machine Scale Sets`.
- Integrar módulos adicionales para Azure Storage, bases de datos o Key Vault.
- Automatizar despliegue con Azure DevOps o GitHub Actions.
- Usar un backend remoto de Terraform Cloud/Enterprise para estado compartido.
