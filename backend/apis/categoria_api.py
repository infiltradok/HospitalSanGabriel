import logging

import pyodbc

from fastapi import APIRouter, HTTPException

from schemas.categoria_schema import (
    CategoriaCrear,
    CategoriaResponse,
    CategoriaRegistroResponse
)

from services.categoria_service import (
    obtener_categorias,
    crear_categoria
)


router = APIRouter(
    prefix="/api/categorias",
    tags=["Categorias"]
)

logger = logging.getLogger(__name__)


# ==========================================
# LISTAR CATEGORÍAS
# ==========================================

@router.get(
    "",
    response_model=list[CategoriaResponse],
    summary="Listar categorías"
)
def listar_categorias_api():

    try:
        return obtener_categorias()

    except Exception:

        logger.exception(
            "Error al consultar categorías"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudieron consultar las categorías"
        )


# ==========================================
# REGISTRAR CATEGORÍA
# ==========================================

@router.post(
    "",
    response_model=CategoriaRegistroResponse,
    status_code=201,
    summary="Registrar nueva categoría"
)
def registrar_categoria_api(
    categoria: CategoriaCrear
):

    try:
        return crear_categoria(categoria)

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except pyodbc.Error:

        logger.exception(
            "SQL Server rechazó el registro de categoría"
        )

        raise HTTPException(
            status_code=400,
            detail="SQL Server rechazó los datos de la categoría"
        )

    except Exception:

        logger.exception(
            "Error inesperado al registrar categoría"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudo registrar la categoría"
        )