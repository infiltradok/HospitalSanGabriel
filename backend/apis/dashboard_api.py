import logging

from fastapi import APIRouter, HTTPException

from schemas.dashboard_schema import IndicadoresInventarioResponse
from services.dashboard_service import obtener_indicadores


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

logger = logging.getLogger(__name__)


@router.get(
    "/indicadores",
    response_model=IndicadoresInventarioResponse,
    summary="Consultar indicadores del inventario"
)
def consultar_indicadores_api():
    try:
        return obtener_indicadores()

    except Exception:
        logger.exception(
            "Error al consultar indicadores del inventario"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudieron consultar los indicadores"
        )