from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from .routes import auth, admin_users, products, operations, ledger, dashboard

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="IMS Backend Modular")

# ==== CORS ====
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"       # only for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== ROUTERS ====
app.include_router(auth.router)
app.include_router(admin_users.router)
app.include_router(products.router)
app.include_router(operations.router)
app.include_router(ledger.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"msg": "IMS API running"}
