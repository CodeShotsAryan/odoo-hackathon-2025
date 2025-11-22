from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from ..db import get_db
from ..models import StockLedger
from ..dependencies import require_role

router = APIRouter(prefix="/ledger", tags=["ledger"])

@router.get("", dependencies=[Depends(require_role(["admin", "stock_manager"]))])
def ledger(product_id: int = None,
           move_type: str = None,
           from_date: datetime = None,
           to_date: datetime = None,
           db: Session = Depends(get_db)):

    q = db.query(StockLedger)

    if product_id:
        q = q.filter(StockLedger.product_id == product_id)
    if move_type:
        q = q.filter(StockLedger.move_type == move_type)
    if from_date:
        q = q.filter(StockLedger.created_at >= from_date)
    if to_date:
        q = q.filter(StockLedger.created_at <= to_date)

    return q.order_by(StockLedger.created_at.desc()).all()
