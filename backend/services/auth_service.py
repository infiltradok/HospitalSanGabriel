import hashlib
import hmac
import os

from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from fastapi import HTTPException, status

from repositories.auth_repository import buscar_usuario

load_dotenv()


def verificar_password(password: str, password_hash: str) -> bool:
    try:
        algoritmo, iteraciones, salt, hash_guardado = password_hash.split("$")

        if algoritmo != "pbkdf2_sha256":
            return False

        calculado = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt),
            int(iteraciones)
        )

        return hmac.compare_digest(
            calculado,
            bytes.fromhex(hash_guardado)
        )

    except (ValueError, TypeError):
        return False


def iniciar_sesion(usuario: str, password: str):
    datos = buscar_usuario(usuario)

    if not datos or not verificar_password(
        password,
        datos["password_hash"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )

    clave = os.getenv("JWT_SECRET")

    if not clave:
        raise RuntimeError("Falta JWT_SECRET en .env")

    vencimiento = datetime.now(timezone.utc) + timedelta(minutes=60)

    token = jwt.encode(
        {
            "sub": str(datos["id_usuario"]),
            "usuario": datos["usuario"],
            "rol": datos["rol"],
            "exp": vencimiento
        },
        clave,
        algorithm="HS256"
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "nombre": datos["nombre"],
        "usuario": datos["usuario"],
        "rol": datos["rol"]
    }