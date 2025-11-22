from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .routes import auth, admin_users, products, operations, ledger, dashboard
from .routes.warehouse import warehouse_router, location_router, adjustment_router, receipt_router, delivery_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="IMS Backend Complete")

origins = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "*"]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router)
app.include_router(admin_users.router)
app.include_router(products.router)
app.include_router(operations.router)
app.include_router(ledger.router)
app.include_router(dashboard.router)
app.include_router(warehouse_router)
app.include_router(location_router)
app.include_router(adjustment_router)
app.include_router(receipt_router)
app.include_router(delivery_router)

@app.get("/")
def root():
    return {"msg": "IMS API Complete"}