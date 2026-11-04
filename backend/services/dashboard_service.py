from repositories.dashboard_repository import obtener_indicadores_repository
from schemas.dashboard_schema import IndicadoresInventarioResponse


def obtener_indicadores() -> IndicadoresInventarioResponse:
    datos = obtener_indicadores_repository()

    return IndicadoresInventarioResponse(**datos)