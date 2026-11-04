from database.connection import get_connection

from schemas.salida_schema import SalidaCrear


# ==========================================
# REPOSITORIO DE SALIDAS
# ==========================================

def registrar_salida(datos: SalidaCrear):

    conexion = get_connection()

    try:

        cursor = conexion.cursor()

        cursor.execute(
            """
            EXEC dbo.sp_RegistrarSalida
                @IdProducto = ?,
                @IdLote = ?,
                @IdArea = ?,
                @Cantidad = ?,
                @Motivo = ?
            """,
            (
                datos.id_producto,
                datos.id_lote,
                datos.id_area,
                datos.cantidad,
                datos.motivo
            )
        )

        # CONSUMIR RESULTADOS PENDIENTES
        while cursor.nextset():
            pass

        # CONFIRMAR TRANSACCIÓN
        conexion.commit()

        return {
            "mensaje": "Salida registrada correctamente",
            "id_producto": datos.id_producto,
            "id_lote": datos.id_lote,
            "id_area": datos.id_area,
            "cantidad": datos.cantidad
        }

    except Exception:

        conexion.rollback()
        raise

    finally:

        conexion.close()

# ==========================================
# LISTAR LOTES DISPONIBLES
# ==========================================

def listar_lotes_disponibles(id_producto: int):

    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            "EXEC dbo.sp_ListarLotesDisponibles @IdProducto = ?",
            (id_producto,)
        )

        lotes = []

        for fila in cursor.fetchall():

            lotes.append({
                "id_lote": fila[0],
                "id_producto": fila[1],
                "numero_lote": fila[2],
                "stock_lote": fila[3],
                "fecha_vencimiento": fila[4]
            })

        return lotes

    finally:
        conexion.close()


# ==========================================
# LISTAR ÁREAS HOSPITALARIAS
# ==========================================

def listar_areas_hospitalarias():

    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            "EXEC dbo.sp_ListarAreasHospitalarias"
        )

        areas = []

        for fila in cursor.fetchall():

            areas.append({
                "id_area": fila[0],
                "nombre": fila[1]
            })

        return areas

    finally:
        conexion.close()