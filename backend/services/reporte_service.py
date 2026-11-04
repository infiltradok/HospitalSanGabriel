from datetime import date

from repositories.reporte_repository import (
    obtener_stock_bajo_repository,
    obtener_vencimientos_repository,
    obtener_mas_solicitados_repository
)

from schemas.reporte_schema import (
    ProductoStockBajoResponse,
    ProductoVencimientoResponse,
    ProductoMasSolicitadoResponse
)


# ==========================================
# 1. REPORTE DE PRODUCTOS CON STOCK BAJO
# ==========================================

def obtener_stock_bajo() -> list[ProductoStockBajoResponse]:

    registros = obtener_stock_bajo_repository()

    productos = []

    for registro in registros:

        producto = ProductoStockBajoResponse(
            id_producto=registro["IdProducto"],
            codigo=registro["Codigo"],
            nombre=registro["Nombre"],
            categoria=registro["Categoria"],
            stock_actual=registro["StockActual"],
            stock_minimo=registro["StockMinimo"],
            unidad_medida=registro["UnidadMedida"],
            estado_stock=registro["EstadoStock"]
        )

        productos.append(producto)

    return productos


# ==========================================
# 2. REPORTE DE VENCIMIENTOS
# ==========================================

def obtener_vencimientos() -> list[ProductoVencimientoResponse]:

    registros = obtener_vencimientos_repository()

    productos = []

    for registro in registros:

        producto = ProductoVencimientoResponse(
            codigo=registro["Codigo"],
            producto=registro["Producto"],
            numero_lote=registro["NumeroLote"],
            fecha_vencimiento=registro["FechaVencimiento"],
            stock_lote=registro["StockLote"],
            dias_restantes=registro["DiasRestantes"],
            estado_vencimiento=registro["EstadoVencimiento"]
        )

        productos.append(producto)

    return productos


# ==========================================
# 3. REPORTE DE PRODUCTOS MÁS SOLICITADOS
# ==========================================

def obtener_mas_solicitados(
    fecha_inicio: date,
    fecha_fin: date
) -> list[ProductoMasSolicitadoResponse]:

    if fecha_inicio > fecha_fin:
        raise ValueError(
            "La fecha inicial no puede ser posterior a la fecha final"
        )

    registros = obtener_mas_solicitados_repository(
        fecha_inicio,
        fecha_fin
    )

    productos = []

    for registro in registros:

        producto = ProductoMasSolicitadoResponse(
            id_producto=registro["IdProducto"],
            codigo=registro["Codigo"],
            nombre=registro["Nombre"],
            total_salidas=registro["TotalSalidas"],
            numero_movimientos=registro["NumeroMovimientos"]
        )

        productos.append(producto)

    return productos