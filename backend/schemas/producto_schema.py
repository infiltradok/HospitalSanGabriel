
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field


class ProductoCrear(BaseModel):
    codigo: str = Field(min_length=1, max_length=30)
    nombre: str = Field(min_length=1, max_length=150)
    descripcion: str | None = None
    categoria_id: int = Field(gt=0)
    unidad_medida: str = Field(min_length=1, max_length=50)
    precio_unitario: Decimal = Field(gt=0)
    stock_minimo: int = Field(ge=0)
    fecha_vencimiento: date | None = None


class ProductoResponse(BaseModel):
    id_producto: int
    codigo: str
    nombre: str
    categoria_id: int
    stock_actual: int
    mensaje: str


from datetime import date
from pydantic import BaseModel
from typing import Optional


class ProductoListado(BaseModel):

    id_producto: int
    codigo: str
    nombre: str
    descripcion: Optional[str] = None
    categoria_id: int
    categoria: str
    unidad_medida: str
    precio_unitario: float
    stock_minimo: int
    stock_actual: int
    fecha_vencimiento: Optional[date] = None
    activo: bool