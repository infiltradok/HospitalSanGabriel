
from repositories.categoria_repository import listar_categorias


def obtener_categorias():
    categorias = listar_categorias()

    return categorias


from repositories.categoria_repository import registrar_categoria_repository


def crear_categoria(categoria):

    nombre = categoria.nombre.strip()

    if not nombre:
        raise ValueError(
            "El nombre de la categoría es obligatorio"
        )

    descripcion = (
        categoria.descripcion.strip()
        if categoria.descripcion is not None
        else None
    )

    categoria.nombre = nombre
    categoria.descripcion = descripcion

    return registrar_categoria_repository(categoria)