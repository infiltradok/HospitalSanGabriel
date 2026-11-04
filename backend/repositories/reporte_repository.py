from datetime import date

from database.connection import get_connection


# CONVERTIR RESULTADOS DE SQL SERVER A DICCIONARIOS
def convertir_resultados(cursor):

    columnas = [
        columna[0]
        for columna in cursor.description
    ]

    resultados = []

    for fila in cursor.fetchall():

        resultados.append(
            dict(zip(columnas, fila))
        )

    return resultados


# 1. PRODUCTOS CON STOCK BAJO
def obtener_stock_bajo_repository():

    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            "EXEC dbo.sp_ProductosStockBajo"
        )

        return convertir_resultados(cursor)

    finally:
        conexion.close()


# 2. PRODUCTOS PRÓXIMOS A VENCER
def obtener_vencimientos_repository():

    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            "EXEC dbo.sp_ConsultarVencimientos"
        )

        return convertir_resultados(cursor)

    finally:
        conexion.close()


# 3. PRODUCTOS MÁS SOLICITADOS
def obtener_mas_solicitados_repository(
    fecha_inicio: date,
    fecha_fin: date
):

    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            """
            EXEC dbo.sp_ProductosMasSolicitados
                @FechaInicio = ?,
                @FechaFin = ?
            """,
            fecha_inicio,
            fecha_fin
        )

        return convertir_resultados(cursor)

    finally:
        conexion.close()
        