from pydantic import BaseModel, ConfigDict


class IndicadoresInventarioResponse(BaseModel):
    productos_activos: int
    productos_stock_bajo: int
    productos_proximos_vencer: int
    productos_vencidos: int
    valor_inventario: float

    model_config = ConfigDict(from_attributes=True)