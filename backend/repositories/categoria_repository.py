from database.connection import get_connection

from schemas.categoria_schema import CategoriaCrear


# ==========================================
# LISTAR CATEGORÍAS
# ==========================================

def listar_categorias():

    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            "EXEC dbo.sp_ListarCategorias"
        )

        categorias = []

        for fila in cursor.fetchall():

            categorias.append({
                "id_categoria": fila.IdCategoria,
                "nombre": fila.Nombre,
                "descripcion": fila.Descripcion,
                "activo": bool(fila.Activo)
            })

        return categorias

    finally:
        conexion.close()


# ==========================================
# REGISTRAR CATEGORÍA
# ==========================================

def registrar_categoria_repository(
    categoria: CategoriaCrear
):

    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            """
            EXEC dbo.sp_RegistrarCategoria
                @Nombre = ?,
                @Descripcion = ?
            """,
            categoria.nombre,
            categoria.descripcion
        )

        # Consumir posibles conjuntos de resultados
        # antes de confirmar la transacción.
        while cursor.nextset():
            pass

        conexion.commit()

        return {
            "mensaje": "Categoría registrada correctamente"
        }

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()