# server/app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt
from .settings import JWT_SECRET, JWT_ALG
from .db import get_db
from .models import User, Role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == payload.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def require_role(allowed_roles: list):
    def wrapper(user: User = Depends(get_current_user),
                db: Session = Depends(get_db)):
        role = db.query(Role).filter(Role.id == user.role_id).first()
        if not role or role.name not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return wrapper
