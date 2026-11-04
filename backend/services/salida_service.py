from schemas.salida_schema import SalidaCrear

from repositories.salida_repository import registrar_salida


# ==========================================
# SERVICIO DE SALIDAS
# ==========================================

def crear_salida(datos: SalidaCrear):

    return registrar_salida(datos)

from repositories.salida_repository import (
    listar_lotes_disponibles,
    listar_areas_hospitalarias
)


def obtener_lotes_disponibles(id_producto: int):

    return listar_lotes_disponibles(id_producto)


def obtener_areas_hospitalarias():

    return listar_areas_hospitalarias()