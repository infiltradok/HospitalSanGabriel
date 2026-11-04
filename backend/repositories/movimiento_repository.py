from datetime import date

from database.connection import get_connection


# ==========================================
# REPOSITORIO DE MOVIMIENTOS
# ==========================================

def consultar_movimientos(
    id_producto: int | None = None,
    tipo_movimiento: str | None = None,
    id_area: int | None = None,
    fecha_inicio: date | None = None,
    fecha_fin: date | None = None
):

    conexion = get_connection()

    try:

        cursor = conexion.cursor()

        # EJECUTAR PROCEDIMIENTO ALMACENADO
        cursor.execute(
            """
            EXEC dbo.sp_ConsultarMovimientos
                @IdProducto = ?,
                @TipoMovimiento = ?,
                @IdArea = ?,
                @FechaInicio = ?,
                @FechaFin = ?
            """,
            (
                id_producto,
                tipo_movimiento,
                id_area,
                fecha_inicio,
                fecha_fin
            )
        )

        movimientos = []

        # OBTENER RESULTADOS
        for fila in cursor.fetchall():

            movimiento = {

                "id_movimiento": fila[0],

                "fecha_movimiento": fila[1],

                "tipo_movimiento": fila[2],

                "codigo_producto": fila[3],

                "producto": fila[4],

                "numero_lote": fila[5],

                "fecha_vencimiento": fila[6],

                "area_destino": fila[7],

                "cantidad": fila[8],

                "motivo": fila[9],

                "stock_anterior": fila[10],

                "stock_posterior": fila[11]

            }

            movimientos.append(movimiento)

        return movimientos

    finally:

        conexion.close()