from pydantic import BaseModel, Field


# ESQUEMA PARA REGISTRAR CATEGORÍAS
class CategoriaCrear(BaseModel):
    nombre: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    descripcion: str | None = Field(
        default=None,
        max_length=250
    )


# ESQUEMA PARA LISTAR CATEGORÍAS
class CategoriaResponse(BaseModel):
    id_categoria: int
    nombre: str
    descripcion: str | None = None
    activo: bool


# RESPUESTA DEL REGISTRO
class CategoriaRegistroResponse(BaseModel):
    mensaje: str