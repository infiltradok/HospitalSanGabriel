from database.connection import get_connection


def buscar_usuario(usuario: str):
    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            "EXEC dbo.sp_BuscarUsuario @Usuario = ?",
            (usuario,)
        )

        fila = cursor.fetchone()

        if fila is None:
            return None

        return {
            "id_usuario": fila[0],
            "nombre": fila[1],
            "usuario": fila[2],
            "password_hash": fila[3],
            "rol": fila[4],
            "activo": bool(fila[5])
        }

    finally:
        conexion.close()