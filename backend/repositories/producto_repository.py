
from database.connection import get_connection


def registrar_producto(datos):
    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            """
            EXEC dbo.sp_RegistrarProducto
                @Codigo = ?,
                @Nombre = ?,
                @Descripcion = ?,
                @IdCategoria = ?,
                @UnidadMedida = ?,
                @PrecioUnitario = ?,
                @StockMinimo = ?,
                @FechaVencimiento = ?
            """,
            (
                datos.codigo,
                datos.nombre,
                datos.descripcion,
                datos.categoria_id,
                datos.unidad_medida,
                datos.precio_unitario,
                datos.stock_minimo,
                datos.fecha_vencimiento
            )
        )

        fila = cursor.fetchone()

        if fila is None:
            raise RuntimeError(
                "El procedimiento no devolvio el producto"
            )

        producto = {
            "id_producto": fila.IdProducto,
            "codigo": fila.Codigo,
            "nombre": fila.Nombre,
            "categoria_id": fila.IdCategoria,
            "stock_actual": fila.StockActual,
            "mensaje": "Producto registrado correctamente"
        }

        cursor.close()
        conexion.commit()

        return producto

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()


def listar_productos():
    from database.connection import get_connection

    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute("EXEC dbo.sp_ListarProductos")

        columnas = [
            columna[0]
            for columna in cursor.description
        ]

        productos = []

        for fila in cursor.fetchall():

            producto = dict(zip(columnas, fila))

            productos.append({
                "id_producto": producto["IdProducto"],
                "codigo": producto["Codigo"],
                "nombre": producto["Nombre"],
                "descripcion": producto["Descripcion"],
                "categoria_id": producto["IdCategoria"],
                "categoria": producto["Categoria"],
                "unidad_medida": producto["UnidadMedida"],
                "precio_unitario": float(
                    producto["PrecioUnitario"]
                ),
                "stock_minimo": producto["StockMinimo"],
                "stock_actual": producto["StockActual"],
                "fecha_vencimiento": (
                    producto["FechaVencimiento"].isoformat()
                    if producto["FechaVencimiento"]
                    else None
                ),
                "activo": bool(producto["Activo"])
            })

        return productos

    finally:
        conexion.close()