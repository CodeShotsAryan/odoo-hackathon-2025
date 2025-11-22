from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from ..db import get_db
from ..dependencies import require_role, get_current_user
from ..models import StockLedger, Location, User
from ..schemas.operations import OperationIn

router = APIRouter(prefix="/operations", tags=["operations"])

# ------------------- HELPER -------------------
def serialize_operation(r: StockLedger, db: Session, move_type: str):
    """Return a dict with metadata and a lines array for receipts/deliveries"""
    location_from = db.query(Location).filter(Location.id == r.location_src_id).first() if r.location_src_id else None
    location_to = db.query(Location).filter(Location.id == r.location_dest_id).first() if r.location_dest_id else None
    user_obj = db.query(User).filter(User.id == r.user_id).first() if r.user_id else None

    lines = [{
        "id": str(r.id),
        "productId": r.product_id,
        "qty": abs(r.qty_change),
        "availableStock": 0,  # optionally compute real stock
    }]

    return {
        "id": r.id,
        "reference": r.reference or "",
        "from": location_from.name if location_from else ("Vendor" if move_type=="receipt" else ""),
        "to": location_to.name if location_to else ("Customer" if move_type=="delivery" else ""),
        "contact": user_obj.name if user_obj else "",
        "scheduleDate": r.created_at.isoformat(),
        "status": "Done",
        "lines": lines
    }

# ------------------- RECEIPTS CRUD -------------------
@router.post("/receipts/", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def create_receipt(payload: OperationIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not payload.location_dest_id:
        raise HTTPException(400, "Destination location required")

    entry = StockLedger(
        product_id=payload.product_id,
        qty_change=abs(float(payload.qty)),
        move_type="receipt",
        reference=payload.reference,
        location_dest_id=payload.location_dest_id,
        user_id=user.id
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return serialize_operation(entry, db, move_type="receipt")

@router.get("/receipts/", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def list_receipts(db: Session = Depends(get_db)):
    receipts = db.query(StockLedger).filter(StockLedger.move_type == "receipt").all()
    return [serialize_operation(r, db, "receipt") for r in receipts]

@router.get("/receipts/{receipt_id}", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def get_receipt(receipt_id: int, db: Session = Depends(get_db)):
    r = db.query(StockLedger).filter(StockLedger.id == receipt_id, StockLedger.move_type == "receipt").first()
    if not r:
        raise HTTPException(404, "Receipt not found")
    return serialize_operation(r, db, "receipt")

@router.put("/receipts/{receipt_id}", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def update_receipt(receipt_id: int, payload: OperationIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    r = db.query(StockLedger).filter(StockLedger.id == receipt_id, StockLedger.move_type == "receipt").first()
    if not r:
        raise HTTPException(404, "Receipt not found")

    r.qty_change = abs(float(payload.qty)) if payload.qty is not None else r.qty_change
    r.reference = payload.reference or r.reference
    r.location_dest_id = payload.location_dest_id or r.location_dest_id
    r.user_id = user.id

    db.commit()
    db.refresh(r)
    return serialize_operation(r, db, "receipt")

@router.delete("/receipts/{receipt_id}", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def delete_receipt(receipt_id: int, db: Session = Depends(get_db)):
    r = db.query(StockLedger).filter(StockLedger.id == receipt_id, StockLedger.move_type == "receipt").first()
    if not r:
        raise HTTPException(404, "Receipt not found")
    db.delete(r)
    db.commit()
    return {"msg": "Receipt deleted"}

# ------------------- DELIVERIES CRUD -------------------
@router.post("/deliveries/", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def create_delivery(payload: OperationIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not payload.location_src_id:
        raise HTTPException(400, "Source location required")
    entry = StockLedger(
        product_id=payload.product_id,
        qty_change=-abs(float(payload.qty)),
        move_type="delivery",
        reference=payload.reference,
        location_src_id=payload.location_src_id,
        user_id=user.id
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return serialize_operation(entry, db, "delivery")

@router.get("/deliveries/", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def list_deliveries(db: Session = Depends(get_db)):
    deliveries = db.query(StockLedger).filter(StockLedger.move_type == "delivery").all()
    return [serialize_operation(r, db, "delivery") for r in deliveries]

@router.get("/deliveries/{delivery_id}", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def get_delivery(delivery_id: int, db: Session = Depends(get_db)):
    r = db.query(StockLedger).filter(StockLedger.id == delivery_id, StockLedger.move_type == "delivery").first()
    if not r:
        raise HTTPException(404, "Delivery not found")
    return serialize_operation(r, db, "delivery")

@router.put("/deliveries/{delivery_id}", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def update_delivery(delivery_id: int, payload: OperationIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    r = db.query(StockLedger).filter(StockLedger.id == delivery_id, StockLedger.move_type == "delivery").first()
    if not r:
        raise HTTPException(404, "Delivery not found")

    r.qty_change = -abs(float(payload.qty)) if payload.qty is not None else r.qty_change
    r.reference = payload.reference or r.reference
    r.location_src_id = payload.location_src_id or r.location_src_id
    r.user_id = user.id

    db.commit()
    db.refresh(r)
    return serialize_operation(r, db, "delivery")

@router.delete("/deliveries/{delivery_id}", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def delete_delivery(delivery_id: int, db: Session = Depends(get_db)):
    r = db.query(StockLedger).filter(StockLedger.id == delivery_id, StockLedger.move_type == "delivery").first()
    if not r:
        raise HTTPException(404, "Delivery not found")
    db.delete(r)
    db.commit()
    return {"msg": "Delivery deleted"}

# ------------------- TRANSFER -------------------
@router.post("/transfer", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def transfer(payload: OperationIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not payload.location_src_id or not payload.location_dest_id:
        raise HTTPException(400, "source & destination required")

    entry = StockLedger(
        product_id=payload.product_id,
        qty_change=-abs(float(payload.qty)),
        move_type="transfer",
        reference=payload.reference,
        location_src_id=payload.location_src_id,
        location_dest_id=payload.location_dest_id,
        user_id=user.id
    )
    db.add(entry)
    db.commit()
    return {"msg": "transfer recorded"}

# ------------------- ADJUST -------------------
@router.post("/adjust", dependencies=[Depends(require_role(["admin", "stock_manager"]))])
def adjust(payload: OperationIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    location_id = payload.location_dest_id or payload.location_src_id

    total = db.query(func.coalesce(func.sum(StockLedger.qty_change), 0)).filter(
        StockLedger.product_id == payload.product_id,
        ((StockLedger.location_dest_id == location_id) |
         (StockLedger.location_src_id == location_id))
    ).scalar() or 0

    counted_qty = float(payload.qty)
    diff = counted_qty - total

    entry = StockLedger(
        product_id=payload.product_id,
        qty_change=diff,
        move_type="adjust",
        reference=payload.reference,
        location_dest_id=location_id,
        user_id=user.id
    )

    db.add(entry)
    db.commit()
    return {"msg": "adjustment recorded", "difference": diff}
