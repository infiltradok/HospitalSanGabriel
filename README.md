# Sistema de Inventario Hospitalario San Gabriel

## Descripción

Sistema web desarrollado para gestionar medicamentos,
insumos médicos y materiales hospitalarios.

Permite controlar las existencias, registrar entradas y
salidas, consultar movimientos históricos y generar
reportes del inventario.

## Tecnologías utilizadas

- Angular 22
- TypeScript
- HTML y CSS
- Python
- FastAPI
- SQL Server
- Procedimientos almacenados
- Git y GitHub

## Funcionalidades

1. Gestión de productos hospitalarios.
2. Registro y consulta de categorías.
3. Registro de entradas de inventario.
4. Registro de salidas por área hospitalaria.
5. Control de stock por producto y lote.
6. Historial de movimientos.
7. Dashboard con indicadores.
8. Reportes de stock bajo y vencimientos.
9. Consulta de productos más solicitados.

## Arquitectura del backend

El backend utiliza cuatro capas:

- APIs: endpoints HTTP.
- Services: validaciones y reglas de negocio.
- Repositories: ejecución de procedimientos almacenados.
- Schemas: modelos de entrada y salida.

## Instalación del backend

Ubicarse en la carpeta backend:

```powershell
cd backend
```

Crear el entorno virtual:

```powershell
py -m venv .venv
```

Activarlo en PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Instalar las dependencias desde requirements.txt:

```powershell
pip install -r requirements.txt
```

Configurar las variables de entorno para la conexión
con SQL Server.

Iniciar FastAPI:

```powershell
python -m uvicorn main:app --reload
```

Documentación Swagger:

http://127.0.0.1:8000/docs

## Instalación del frontend

Ubicarse en la carpeta del frontend:

```powershell
cd frontend
```

Instalar dependencias:

```powershell
npm install
```

Iniciar Angular:

```powershell
ng serve
```

Acceder a:

http://localhost:4200

## Base de datos

El sistema utiliza SQL Server y la base de datos
HospitalSanGabrielDB.

Las operaciones de inventario se implementan mediante
procedimientos almacenados.

Las entradas y salidas utilizan transacciones para
mantener la consistencia del stock y del historial.

## Gestión de versiones

El proyecto utiliza Git y GitHub para controlar los cambios.

Se emplean ramas de desarrollo, commits descriptivos
y Pull Requests para integrar modificaciones.

## Proyecto académico

Asignatura: Desarrollo de Aplicaciones Web

Unidad 3 - Semana 12