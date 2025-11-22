from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from ..db import get_db
from ..dependencies import get_current_user
from ..models import Warehouse, Location, StockLedger, Product
from pydantic import BaseModel

warehouse_router = APIRouter(prefix="/warehouses", tags=["warehouses"])
location_router = APIRouter(prefix="/locations", tags=["locations"])
adjustment_router = APIRouter(prefix="/adjustments", tags=["adjustments"])
receipt_router = APIRouter(prefix="/receipts", tags=["receipts"])
delivery_router = APIRouter(prefix="/deliveries", tags=["deliveries"])

class WarehouseCreate(BaseModel):
    name: str

@warehouse_router.get("/")
def list_warehouses(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Warehouse).all()

@warehouse_router.post("/")
def create_warehouse(payload: WarehouseCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    wh = Warehouse(name=payload.name)
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh

@warehouse_router.put("/{warehouse_id}")
def update_warehouse(warehouse_id: int, payload: WarehouseCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    wh = db.query(Warehouse).filter(Warehouse.id == warehouse_id).first()
    if not wh:
        raise HTTPException(404, "Not found")
    wh.name = payload.name
    db.commit()
    return wh

@warehouse_router.delete("/{warehouse_id}")
def delete_warehouse(warehouse_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    wh = db.query(Warehouse).filter(Warehouse.id == warehouse_id).first()
    if not wh:
        raise HTTPException(404, "Not found")
    db.delete(wh)
    db.commit()
    return {"msg": "deleted"}

class LocationCreate(BaseModel):
    name: str
    warehouse_id: int

@location_router.get("/")
def list_locations(db: Session = Depends(get_db), user=Depends(get_current_user)):
    locations = db.query(Location).all()
    result = []
    for loc in locations:
        wh = db.query(Warehouse).filter(Warehouse.id == loc.warehouse_id).first()
        result.append({
            "id": loc.id,
            "name": loc.name,
            "warehouse_id": loc.warehouse_id,
            "warehouse_name": wh.name if wh else "Unknown"
        })
    return result

@location_router.post("/")
def create_location(payload: LocationCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    loc = Location(name=payload.name, warehouse_id=payload.warehouse_id)
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc

@location_router.put("/{location_id}")
def update_location(location_id: int, payload: LocationCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(404, "Not found")
    loc.name = payload.name
    loc.warehouse_id = payload.warehouse_id
    db.commit()
    return loc

@location_router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(404, "Not found")
    db.delete(loc)
    db.commit()
    return {"msg": "deleted"}

@receipt_router.get("/")
def list_receipts(db: Session = Depends(get_db), user=Depends(get_current_user)):
    receipts = db.query(StockLedger).filter(StockLedger.move_type == "receipt").all()
    seen = set()
    result = []
    for r in receipts:
        if r.reference not in seen:
            seen.add(r.reference)
            result.append({
                "id": r.id,
                "reference": r.reference,
                "from": "Vendor",
                "to": "Warehouse",
                "contact": "Contact",
                "schedule_date": r.created_at.isoformat(),
                "status": "Done"
            })
    return result

@delivery_router.get("/")
def list_deliveries(db: Session = Depends(get_db), user=Depends(get_current_user)):
    deliveries = db.query(StockLedger).filter(StockLedger.move_type == "delivery").all()
    seen = set()
    result = []
    for d in deliveries:
        if d.reference not in seen:
            seen.add(d.reference)
            result.append({
                "id": d.id,
                "reference": d.reference,
                "from": "Warehouse",
                "to": "Customer",
                "contact": "Contact",
                "schedule_date": d.created_at.isoformat(),
                "status": "Done"
            })
    return result

class AdjustmentCreate(BaseModel):
    product_id: int
    warehouse_id: int
    location_id: int
    adjustment_type: str
    quantity: int
    reason: str
    note: Optional[str] = None

@adjustment_router.get("/")
def list_adjustments(db: Session = Depends(get_db), user=Depends(get_current_user)):
    ledger = db.query(StockLedger).filter(StockLedger.move_type == "adjust").all()
    result = []
    for entry in ledger:
        product = db.query(Product).filter(Product.id == entry.product_id).first()
        result.append({
            "id": str(entry.id),
            "reference": entry.reference,
            "date": entry.created_at.isoformat(),
            "product_id": entry.product_id,
            "product_name": product.name if product else "Unknown",
            "product_code": product.sku if product else "",
            "quantity": abs(entry.qty_change),
            "type": "ADD" if entry.qty_change > 0 else "REMOVE",
            "status": "Applied",
            "warehouse_id": entry.location_dest_id,
            "location_id": entry.location_dest_id,
            "reason": "Adjustment",
            "created_by": "User",
            "created_at": entry.created_at.isoformat()
        })
    return result

@adjustment_router.post("/")
def create_adjustment(payload: AdjustmentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    qty_change = payload.quantity if payload.adjustment_type == "ADD" else -payload.quantity
    entry = StockLedger(
        product_id=payload.product_id,
        qty_change=qty_change,
        move_type="adjust",
        reference=f"ADJ-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        location_dest_id=payload.location_id,
        user_id=user.id
    )
    db.add(entry)
    db.commit()
    return {"id": str(entry.id), "reference": entry.reference}