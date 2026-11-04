from datetime import date

from pydantic import BaseModel, Field, field_validator


class EntradaCrear(BaseModel):

    id_producto: int = Field(gt=0)

    cantidad: int = Field(gt=0)

    motivo: str = Field(
        min_length=1,
        max_length=250
    )

    numero_lote: str = Field(
        min_length=1,
        max_length=60
    )

    fecha_vencimiento: date

    @field_validator("motivo", "numero_lote")
    @classmethod
    def validar_texto(cls, valor: str) -> str:

        valor = valor.strip()

        if not valor:
            raise ValueError(
                "Este campo no puede estar vacío."
            )

        return valor


class EntradaResponse(BaseModel):

    mensaje: str
    id_producto: int
    cantidad: int
    numero_lote: str