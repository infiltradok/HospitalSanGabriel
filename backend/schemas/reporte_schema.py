from datetime import date
from pydantic import BaseModel, ConfigDict


# REPORTE: PRODUCTOS CON STOCK BAJO
class ProductoStockBajoResponse(BaseModel):

    id_producto: int
    codigo: str
    nombre: str
    categoria: str
    stock_actual: int
    stock_minimo: int
    unidad_medida: str
    estado_stock: str

    model_config = ConfigDict(from_attributes=True)


# REPORTE: VENCIMIENTOS
class ProductoVencimientoResponse(BaseModel):

    codigo: str
    producto: str
    numero_lote: str
    fecha_vencimiento: date
    stock_lote: int
    dias_restantes: int
    estado_vencimiento: str

    model_config = ConfigDict(from_attributes=True)


# REPORTE: PRODUCTOS MÁS SOLICITADOS
class ProductoMasSolicitadoResponse(BaseModel):

    id_producto: int
    codigo: str
    nombre: str
    total_salidas: int
    numero_movimientos: int

    model_config = ConfigDict(from_attributes=True)