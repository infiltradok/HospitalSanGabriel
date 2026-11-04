
import os
from pathlib import Path

import pyodbc
from dotenv import load_dotenv

# Ubicación de la carpeta backend
BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar variables del archivo .env
load_dotenv(BASE_DIR / ".env")


def get_connection():
    server = os.getenv("DB_SERVER")
    database = os.getenv("DB_NAME")
    driver = os.getenv("DB_DRIVER")

    if not server or not database or not driver:
        raise RuntimeError(
            "Faltan variables de conexion en el archivo .env"
        )

    connection_string = (
        f"DRIVER={{{driver}}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        "Trusted_Connection=yes;"
        "Encrypt=yes;"
        "TrustServerCertificate=yes;"
    )

    conexion = pyodbc.connect(
        connection_string,
        timeout=5
    )

    return conexion
