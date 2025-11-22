from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from ..db import get_db
from ..dependencies import require_role, get_current_user
from ..models import StockLedger, Product
from ..schemas.operations import OperationIn

router = APIRouter(prefix="/operations", tags=["operations"])

@router.post("/receipt", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def receipt(payload: OperationIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    p = db.query(Product).filter(Product.id == payload.product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")

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
    return {"msg": "receipt recorded"}

@router.post("/delivery", dependencies=[Depends(require_role(["admin", "stock_manager", "warehouse_staff"]))])
def delivery(payload: OperationIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
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
    return {"msg": "delivery recorded"}

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
