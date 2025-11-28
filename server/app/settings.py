import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "your_postgres"
)

JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_key")
JWT_ALG = "HS256"

OTP_EXP_MINUTES = int(os.getenv("OTP_EXP_MINUTES", "10"))
OTP_RESEND_WINDOW_SECONDS = int(os.getenv("OTP_RESEND_WINDOW_SECONDS", "60"))

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "your_email@gmail
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)
