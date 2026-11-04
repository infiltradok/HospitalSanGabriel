from datetime import datetime, date
from pydantic import BaseModel


# ==========================================
# ESQUEMA DEL HISTORIAL DE MOVIMIENTOS
# ==========================================

class MovimientoResponse(BaseModel):

    id_movimiento: int

    fecha_movimiento: datetime

    tipo_movimiento: str

    codigo_producto: str

    producto: str

    numero_lote: str

    fecha_vencimiento: date | None = None

    area_destino: str | None = None

    cantidad: int

    motivo: str | None = None

    stock_anterior: int

    stock_posterior: int