import logging
import pyodbc

from fastapi import APIRouter, HTTPException, status

from schemas.producto_schema import (
    ProductoCrear,
    ProductoResponse,
    ProductoListado
)

from services.producto_service import (
    crear_producto,
    obtener_productos
)


# ==========================================
# CONFIGURACIÓN DEL ROUTER
# ==========================================

router = APIRouter(
    prefix="/api/productos",
    tags=["Productos"]
)

logger = logging.getLogger(__name__)


# ==========================================
# POST - REGISTRAR PRODUCTO
# ==========================================

@router.post(
    "",
    response_model=ProductoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar nuevo producto"
)
def registrar_producto_api(producto: ProductoCrear):

    try:

        return crear_producto(producto)

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    except pyodbc.Error as error:

        logger.warning(
            "SQL Server rechazó el producto: %s",
            error
        )

        mensaje_error = str(error).lower()

        # COMPROBAR CÓDIGO DUPLICADO
        if (
            "el codigo del producto ya existe" in mensaje_error
            or "el código del producto ya existe" in mensaje_error
        ):

            raise HTTPException(
                status_code=409,
                detail="El código del producto ya existe"
            ) from error

        raise HTTPException(
            status_code=400,
            detail="SQL Server rechazó los datos del producto"
        ) from error

    except Exception as error:

        logger.exception(
            "Error inesperado al registrar producto"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudo registrar el producto"
        ) from error


# ==========================================
# GET - LISTAR PRODUCTOS
# ==========================================

@router.get(
    "",
    response_model=list[ProductoListado],
    status_code=status.HTTP_200_OK,
    summary="Listar productos registrados"
)
def listar_productos_api():

    try:

        productos = obtener_productos()

        return productos

    except pyodbc.Error as error:

        logger.exception(
            "Error de SQL Server al listar productos"
        )

        raise HTTPException(
            status_code=500,
            detail="Error al consultar productos en SQL Server"
        ) from error

    except Exception as error:

        logger.exception(
            "Error inesperado al listar productos"
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudieron consultar los productos"
        ) from error