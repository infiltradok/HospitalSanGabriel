from datetime import date

from repositories.movimiento_repository import consultar_movimientos


# ==========================================
# SERVICIO DE MOVIMIENTOS
# ==========================================

def obtener_movimientos(
    id_producto: int | None = None,
    tipo_movimiento: str | None = None,
    id_area: int | None = None,
    fecha_inicio: date | None = None,
    fecha_fin: date | None = None
):

    # VALIDAR EL PRODUCTO
    if id_producto is not None and id_producto <= 0:
        raise ValueError(
            "El identificador del producto debe ser positivo."
        )

    # VALIDAR EL ÁREA
    if id_area is not None and id_area <= 0:
        raise ValueError(
            "El identificador del área debe ser positivo."
        )

    # VALIDAR EL TIPO DE MOVIMIENTO
    if tipo_movimiento is not None:

        tipo_movimiento = tipo_movimiento.upper()

        if tipo_movimiento not in ["ENTRADA", "SALIDA"]:
            raise ValueError(
                "El tipo de movimiento debe ser ENTRADA o SALIDA."
            )

    # VALIDAR EL RANGO DE FECHAS
    if (
        fecha_inicio is not None
        and fecha_fin is not None
        and fecha_inicio > fecha_fin
    ):
        raise ValueError(
            "La fecha inicial no puede ser posterior a la fecha final."
        )

    # CONSULTAR LOS MOVIMIENTOS
    movimientos = consultar_movimientos(
        id_producto=id_producto,
        tipo_movimiento=tipo_movimiento,
        id_area=id_area,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin
    )

    return movimientos