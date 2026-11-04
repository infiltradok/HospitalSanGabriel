import logging
import pyodbc

from fastapi import APIRouter, HTTPException, status

from schemas.entrada_schema import (
    EntradaCrear,
    EntradaResponse
)

from services.entrada_service import crear_entrada


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/entradas",
    tags=["Entradas"]
)


@router.post(
    "",
    response_model=EntradaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar entrada de inventario"
)
def registrar_entrada_api(datos: EntradaCrear):

    try:

        return crear_entrada(datos)

    except pyodbc.Error as error:

        logger.exception(
            "Error al registrar entrada en SQL Server"
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "No se pudo registrar la entrada. "
                "Comprueba el producto, el lote y las reglas de inventario."
            )
        ) from error

    except Exception as error:

        logger.exception(
            "Error inesperado al registrar entrada"
        )

        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error interno al registrar la entrada."
        ) from error