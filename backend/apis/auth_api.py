from fastapi import APIRouter

from schemas.auth_schema import LoginRequest, LoginResponse
from services.auth_service import iniciar_sesion

router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticación"]
)


@router.post("/login", response_model=LoginResponse)
def login(datos: LoginRequest):
    return iniciar_sesion(
        usuario=datos.usuario,
        password=datos.password
    )