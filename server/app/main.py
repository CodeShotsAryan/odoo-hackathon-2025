from fastapi import FastAPI
from .db import Base, engine
from .routes import auth, admin_users, products, operations, ledger, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="IMS Backend Modular")

app.include_router(auth.router)
app.include_router(admin_users.router)
app.include_router(products.router)
app.include_router(operations.router)
app.include_router(ledger.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"msg": "IMS API running"}
