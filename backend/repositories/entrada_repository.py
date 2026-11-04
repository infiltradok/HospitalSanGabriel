from database.connection import get_connection

from schemas.entrada_schema import EntradaCrear


def registrar_entrada(datos: EntradaCrear):

    conexion = get_connection()

    try:

        cursor = conexion.cursor()

        cursor.execute(
            """
            EXEC dbo.sp_RegistrarEntrada
                @IdProducto = ?,
                @Cantidad = ?,
                @Motivo = ?,
                @NumeroLote = ?,
                @FechaVencimiento = ?
            """,
            (
                datos.id_producto,
                datos.cantidad,
                datos.motivo,
                datos.numero_lote,
                datos.fecha_vencimiento
            )
        )

        # Consumir cualquier resultado pendiente del procedimiento.
        # Esto permite confirmar la transacción correctamente.
        while cursor.nextset():
            pass

        conexion.commit()

        return {
            "mensaje": "Entrada registrada correctamente",
            "id_producto": datos.id_producto,
            "cantidad": datos.cantidad,
            "numero_lote": datos.numero_lote
        }

    except Exception:

        conexion.rollback()
        raise

    finally:

        conexion.close()