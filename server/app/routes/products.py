from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Product
from ..schemas.products import ProductCreate, ProductUpdate
from ..dependencies import get_current_user

router = APIRouter(prefix="/products", tags=["products"])

# ----------------- CREATE ------------------
@router.post("/")
def create_product(payload: ProductCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"msg": "product_created", "product": product}


# ----------------- READ ALL ----------------
@router.get("/")
def list_products(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Product).all()


# ----------------- READ ONE ----------------
@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "product_not_found")
    return product


# ----------------- UPDATE ------------------
@router.put("/{product_id}")
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(404, "product_not_found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return {"msg": "product_updated", "product": product}


# ----------------- DELETE ------------------
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(404, "product_not_found")

    db.delete(product)
    db.commit()

    return {"msg": "product_deleted"}
