from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..schemas.users import UserCreate
from ..models import User
from passlib.context import CryptContext
from ..dependencies import require_role

router = APIRouter(prefix="/admin/users", tags=["admin-users"])
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/create", dependencies=[Depends(require_role(["admin"]))])
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email already exists")

    u = User(
        name=payload.name,
        email=payload.email,
        password_hash=pwd.hash(payload.temp_password),
        role_id=payload.role_id
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"msg": "user created", "user_id": u.id}

@router.patch("/update-role/{id}", dependencies=[Depends(require_role(["admin"]))])
def update_role(id: int, role_id: int, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == id).first()
    if not u:
        raise HTTPException(404, "User not found")

    u.role_id = role_id
    db.commit()
    return {"msg": "role updated"}

@router.get("/", dependencies=[Depends(require_role(["admin"]))])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()
