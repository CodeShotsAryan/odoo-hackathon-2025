from datetime import datetime, timedelta
import random
import smtplib
from email.mime.text import MIMEText
from sqlalchemy.orm import Session
from ..models import OTPCode, User
from ..settings import (
    OTP_EXP_MINUTES,
    OTP_RESEND_WINDOW_SECONDS,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    FROM_EMAIL
)

def _generate_otp():
    return f"{random.randint(100000, 999999)}"


def _send_email(to_email: str, otp: str):
    """
    Sends OTP via SMTP email
    """
    subject = "Your OTP Code"
    body = f"""
    Your OTP code is: {otp}

    It will expire in {OTP_EXP_MINUTES} minutes.
    """

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email

    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print("Email sending failed:", e)


def send_otp(db: Session, email: str, force_new: bool = False):
    now = datetime.utcnow()

    last = db.query(OTPCode).filter(
        OTPCode.email == email
    ).order_by(OTPCode.created_at.desc()).first()

    # RESEND LIMIT ─────────────────────────────────────────
    if last and not last.used and last.expires_at > now:
        age_sec = (now - last.created_at).total_seconds()
        if age_sec < OTP_RESEND_WINDOW_SECONDS and not force_new:
            return {
                "ok": False,
                "reason": "resend_too_soon",
                "wait_seconds": int(OTP_RESEND_WINDOW_SECONDS - age_sec)
            }

    otp = _generate_otp()
    expires = now + timedelta(minutes=OTP_EXP_MINUTES)

    rec = OTPCode(email=email, otp=otp, expires_at=expires)
    db.add(rec)
    db.commit()
    db.refresh(rec)

    # SEND EMAIL
    _send_email(email, otp)

    return {
        "ok": True,
        "message": "OTP sent to your email"
    }


def verify_otp(db: Session, email: str, otp: str, new_password_hash: str):
    now = datetime.utcnow()

    record = db.query(OTPCode).filter(
        OTPCode.email == email,
        OTPCode.otp == otp,
        OTPCode.used == False
    ).order_by(OTPCode.expires_at.desc()).first()

    if not record:
        return {"ok": False, "error": "invalid_otp"}

    if record.expires_at < now:
        return {"ok": False, "error": "expired"}

    record.used = True

    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"ok": False, "error": "user_not_found"}

    user.password_hash = new_password_hash
    db.commit()

    return {"ok": True}
