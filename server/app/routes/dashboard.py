from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from ..db import get_db
from ..models import Product, StockLedger
from ..dependencies import require_role

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("", dependencies=[Depends(require_role(["admin", "stock_manager"]))])
def dashboard(db: Session = Depends(get_db)):
    total_products = db.query(func.count(Product.id)).scalar()

    product_totals = db.query(
        StockLedger.product_id,
        func.coalesce(func.sum(StockLedger.qty_change), 0).label("qty")
    ).group_by(StockLedger.product_id).subquery()

    low_stock_items = db.query(Product).join(
        product_totals, Product.id == product_totals.c.product_id
    ).filter(
        product_totals.c.qty <= Product.min_stock_level
    ).count()

    total_stock = db.query(
        func.coalesce(func.sum(StockLedger.qty_change), 0)
    ).scalar() or 0

    return {
        "total_products": total_products,
        "low_stock_items": low_stock_items,
        "total_stock": float(total_stock)
    }
