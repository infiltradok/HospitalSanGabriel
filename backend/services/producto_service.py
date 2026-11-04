
from repositories.producto_repository import registrar_producto


def crear_producto(datos):
    

    datos.codigo = datos.codigo.strip()
    datos.nombre = datos.nombre.strip()
    datos.unidad_medida = datos.unidad_medida.strip()

    if not datos.codigo:
        raise ValueError("El código es obligatorio")

    if not datos.nombre:
        raise ValueError("El nombre es obligatorio")

    if not datos.unidad_medida:
        raise ValueError("La unidad de medida es obligatoria")

    

    return registrar_producto(datos)

def obtener_productos():

    from repositories.producto_repository import listar_productos

    return listar_productos()