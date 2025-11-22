from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str
    uom: str
    barcode: str
    min_stock_level: int

class ProductUpdate(BaseModel):
    name: str | None = None
    sku: str | None = None
    category: str | None = None
    uom: str | None = None
    barcode: str | None = None
    min_stock_level: int | None = None
