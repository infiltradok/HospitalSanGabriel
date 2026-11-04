from database.connection import get_connection


def obtener_indicadores_repository():
    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute("EXEC dbo.sp_IndicadoresInventario")

        fila = cursor.fetchone()

        if fila is None:
            raise ValueError(
                "El procedimiento no devolvió indicadores"
            )

        return {
            "productos_activos": int(fila[0] or 0),
            "productos_stock_bajo": int(fila[1] or 0),
            "productos_proximos_vencer": int(fila[2] or 0),
            "productos_vencidos": int(fila[3] or 0),
            "valor_inventario": float(fila[4] or 0)
        }

    finally:
        conexion.close()