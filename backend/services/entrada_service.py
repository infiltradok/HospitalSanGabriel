from schemas.entrada_schema import EntradaCrear

from repositories.entrada_repository import registrar_entrada


def crear_entrada(datos: EntradaCrear):

    return registrar_entrada(datos)