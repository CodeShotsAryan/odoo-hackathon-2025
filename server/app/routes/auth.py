from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..schemas.auth import LoginIn, OTPRequest, OTPVerify, TokenOut
from ..services.auth_service import send_otp, verify_otp
from ..models import User
from ..settings import JWT_SECRET, JWT_ALG
from passlib.context import CryptContext
from jose import jwt
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_minutes: int = 60*24*7):
    to_encode = data.copy()
    expire = jwt.datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALG)

@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not pwd.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id, "role_id": user.role_id})
    return {"access_token": token}

@router.post("/request-otp")
def request_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    res = send_otp(db, payload.email)

    if not res["ok"]:
        if res.get("reason") == "resend_too_soon":
            raise HTTPException(429, f"Wait {res['wait_seconds']} seconds before resend")
        raise HTTPException(400, res["reason"])

    return {"message": "OTP sent to your email"}


@router.post("/resend-otp")
def resend_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    res = send_otp(db, payload.email, force_new=True)
    return {"message": "OTP resent to your email"}

@router.post("/verify-otp")
def verify(payload: OTPVerify, db: Session = Depends(get_db)):
    new_hash = pwd.hash(payload.new_password)
    res = verify_otp(db, payload.email, payload.otp, new_hash)

    if not res["ok"]:
        raise HTTPException(400, res["error"])
    return {"msg": "password_reset"}
