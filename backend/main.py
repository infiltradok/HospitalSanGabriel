
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apis.categoria_api import router as categoria_router
from apis.producto_api import router as producto_router
from apis.entrada_api import router as entrada_router
from apis.salida_api import router as salida_router
from apis.movimiento_api import router as movimiento_router
from apis.dashboard_api import router as dashboard_router
from apis.reporte_api import router as reporte_router

app = FastAPI(
    title="Hospital San Gabriel API",
    description="API del Sistema de Inventario Hospitalario",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH"],
    allow_headers=["Content-Type", "Authorization"]
)

app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(entrada_router)
app.include_router(salida_router)
app.include_router(movimiento_router)
app.include_router(dashboard_router)
app.include_router(reporte_router)

@app.get("/")
def inicio():
    return {
        "mensaje": "API Hospital San Gabriel",
        "estado": "funcionando"
    }


@app.get("/health")
def verificar_estado():
    return {
        "estado": "correcto"
    }
