from fastapi import FastAPI
import importlib
import pkgutil

app = FastAPI()

@app.get('/')
def root():
    return {"msg":"Odoo Hackathon 2025"}
