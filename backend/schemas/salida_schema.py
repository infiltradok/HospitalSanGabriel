from pydantic import BaseModel, Field, field_validator


# ==========================================
# ESQUEMA PARA REGISTRAR SALIDAS
# ==========================================

class SalidaCrear(BaseModel):

    id_producto: int = Field(gt=0)

    id_lote: int = Field(gt=0)

    id_area: int = Field(gt=0)

    cantidad: int = Field(gt=0)

    motivo: str = Field(
        min_length=1,
        max_length=250
    )

    @field_validator("motivo")
    @classmethod
    def validar_motivo(cls, valor: str) -> str:

        valor = valor.strip()

        if not valor:
            raise ValueError(
                "El motivo no puede estar vacío."
            )

        return valor


# ==========================================
# RESPUESTA DE LA API
# ==========================================

class SalidaResponse(BaseModel):

    mensaje: str

    id_producto: int

    id_lote: int

    id_area: int

    cantidad: int

from datetime import date
from pydantic import BaseModel


class LoteDisponibleResponse(BaseModel):
    id_lote: int
    id_producto: int
    numero_lote: str
    stock_lote: int
    fecha_vencimiento: date


class AreaResponse(BaseModel):
    id_area: int
    nombre: str