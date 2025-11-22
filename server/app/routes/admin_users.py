from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..schemas.users import UserCreate
from ..models import User
from passlib.context import CryptContext
from ..dependencies import require_role
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/admin/users", tags=["admin-users"])
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = "inventrivia@gmail.com"
SMTP_PASSWORD = "jwndhegazrzdbdfn"  # use env var in production

ROLE_MAP = {1: "Admin", 2: "Inventory Manager", 3: "Staff"}

def send_email(to_email: str, subject: str, html_content: str):
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = SMTP_EMAIL
        msg["To"] = to_email
        msg["Subject"] = subject

        part = MIMEText(html_content, "html")
        msg.attach(part)

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")

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

    # Send email to user with credentials
    html_content = f"""
    <html>
    <body>
        <p>Hello <strong>{u.name}</strong>,</p>
        <p>Your account for Inventory Management System has been created.</p>
        <ul>
            <li><strong>Email:</strong> {u.email}</li>
            <li><strong>Password:</strong> {payload.temp_password}</li>
            <li><strong>Role:</strong> {ROLE_MAP.get(u.role_id, "User")}</li>
        </ul>
        <p>Please login and change your password immediately.</p>
    </body>
    </html>
    """
    send_email(u.email, "IMS Account Created", html_content)

    return {"msg": "user created", "user_id": u.id}

@router.patch("/update-role/{id}", dependencies=[Depends(require_role(["admin"]))])
def update_role(id: int, role_id: int, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == id).first()
    if not u:
        raise HTTPException(404, "User not found")

    u.role_id = role_id
    db.commit()

    # Send email notifying role update
    html_content = f"""
    <html>
    <body>
        <p>Hello <strong>{u.name}</strong>,</p>
        <p>Your role has been updated in Inventory Management System.</p>
        <p><strong>New Role:</strong> {ROLE_MAP.get(role_id, "User")}</p>
    </body>
    </html>
    """
    send_email(u.email, "IMS Role Updated", html_content)

    return {"msg": "role updated"}

@router.get("/", dependencies=[Depends(require_role(["admin"]))])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()
