import logging

from datetime import date
from typing import Literal

from fastapi import (
    APIRouter,
    HTTPException,
    Query,
    status
)

from schemas.movimiento_schema import MovimientoResponse

from services.movimiento_service import obtener_movimientos


# ==========================================
# CONFIGURACIÓN
# ==========================================

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/movimientos",
    tags=["Historial"]
)


# ==========================================
# GET - CONSULTAR HISTORIAL
# ==========================================

@router.get(
    "",
    response_model=list[MovimientoResponse],
    status_code=status.HTTP_200_OK,
    summary="Consultar historial de movimientos"
)
def consultar_movimientos_api(

    id_producto: int | None = Query(
        default=None,
        gt=0,
        description="Filtrar por identificador de producto"
    ),

    tipo_movimiento: Literal["ENTRADA", "SALIDA"] | None = Query(
        default=None,
        description="Filtrar por entrada o salida"
    ),

    id_area: int | None = Query(
        default=None,
        gt=0,
        description="Filtrar por área hospitalaria"
    ),

    fecha_inicio: date | None = Query(
        default=None,
        description="Fecha inicial del historial"
    ),

    fecha_fin: date | None = Query(
        default=None,
        description="Fecha final del historial"
    )

):

    try:

        movimientos = obtener_movimientos(
            id_producto=id_producto,
            tipo_movimiento=tipo_movimiento,
            id_area=id_area,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin
        )

        return movimientos

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    except Exception as error:

        logger.exception(
            "Error al consultar el historial de movimientos"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudo consultar el historial de movimientos."
        ) from error    