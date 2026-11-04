import logging
from datetime import date

import pyodbc
from fastapi import APIRouter, HTTPException, Query

from schemas.reporte_schema import (
    ProductoStockBajoResponse,
    ProductoVencimientoResponse,
    ProductoMasSolicitadoResponse
)

from services.reporte_service import (
    obtener_stock_bajo,
    obtener_vencimientos,
    obtener_mas_solicitados
)


router = APIRouter(
    prefix="/api/reportes",
    tags=["Reportes"]
)

logger = logging.getLogger(__name__)


# ==========================================
# 1. REPORTE DE PRODUCTOS CON STOCK BAJO
# ==========================================

@router.get(
    "/stock-bajo",
    response_model=list[ProductoStockBajoResponse],
    summary="Consultar productos con stock bajo"
)
def consultar_stock_bajo_api():

    try:
        return obtener_stock_bajo()

    except Exception:
        logger.exception(
            "Error al consultar productos con stock bajo"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudo consultar el reporte de stock bajo"
        )


# ==========================================
# 2. REPORTE DE VENCIMIENTOS
# ==========================================

@router.get(
    "/vencimientos",
    response_model=list[ProductoVencimientoResponse],
    summary="Consultar productos próximos a vencer"
)
def consultar_vencimientos_api():

    try:
        return obtener_vencimientos()

    except Exception:
        logger.exception(
            "Error al consultar los vencimientos"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudo consultar el reporte de vencimientos"
        )


# ==========================================
# 3. REPORTE DE PRODUCTOS MÁS SOLICITADOS
# ==========================================

@router.get(
    "/mas-solicitados",
    response_model=list[ProductoMasSolicitadoResponse],
    summary="Consultar productos más solicitados"
)
def consultar_mas_solicitados_api(
    fecha_inicio: date = Query(
        ...,
        description="Fecha inicial del reporte"
    ),
    fecha_fin: date = Query(
        ...,
        description="Fecha final del reporte"
    )
):

    try:

        return obtener_mas_solicitados(
            fecha_inicio,
            fecha_fin
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception:

        logger.exception(
            "Error al consultar productos más solicitados"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudo consultar el reporte de productos más solicitados"
        )