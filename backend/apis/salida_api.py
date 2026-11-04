import logging
import pyodbc

from fastapi import APIRouter, HTTPException, status

from schemas.salida_schema import (
    SalidaCrear,
    SalidaResponse
)

from services.salida_service import crear_salida

from schemas.salida_schema import (
    LoteDisponibleResponse,
    AreaResponse
)

from services.salida_service import (
    obtener_lotes_disponibles,
    obtener_areas_hospitalarias
)


# CONFIGURACIÓN
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/salidas",
    tags=["Salidas"]
)


# REGISTRAR SALIDA
@router.post(
    "",
    response_model=SalidaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar salida de inventario"
)
def registrar_salida_api(datos: SalidaCrear):

    try:

        return crear_salida(datos)

    except pyodbc.Error as error:

        logger.warning(
            "SQL Server rechazó la salida: %s",
            error
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "No se pudo registrar la salida. "
                "Verifica el producto, lote, área, "
                "stock disponible y fecha de vencimiento."
            )
        ) from error

    except Exception as error:

        logger.exception(
            "Error inesperado al registrar salida"
        )

        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al registrar la salida."
        ) from error


# ==========================================
# GET - LOTES DISPONIBLES POR PRODUCTO
# ==========================================

@router.get(
    "/lotes/{id_producto}",
    response_model=list[LoteDisponibleResponse],
    summary="Consultar lotes disponibles"
)
def consultar_lotes_api(id_producto: int):

    if id_producto <= 0:
        raise HTTPException(
            status_code=400,
            detail="El identificador del producto debe ser positivo."
        )

    try:

        return obtener_lotes_disponibles(id_producto)

    except Exception as error:

        logger.exception(
            "Error al consultar lotes disponibles"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudieron consultar los lotes."
        ) from error


# ==========================================
# GET - ÁREAS HOSPITALARIAS
# ==========================================

@router.get(
    "/areas",
    response_model=list[AreaResponse],
    summary="Consultar áreas hospitalarias"
)
def consultar_areas_api():

    try:

        return obtener_areas_hospitalarias()

    except Exception as error:

        logger.exception(
            "Error al consultar áreas hospitalarias"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudieron consultar las áreas."
        ) from error