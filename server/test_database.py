# test_db.py
import psycopg2

try:
    conn = psycopg2.connect(
        host="82.112.236.51",
        port=5433,
        database="odoo_hackathon",
        user="aryan",
        password="hackodoo"
    )
    print("✅ Database connected successfully!")
    print(f"📊 PostgreSQL version: {conn.server_version}")
    
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"🔍 Database version: {version[0]}")
    
    cursor.close()
    conn.close()
    print("✅ Connection closed successfully!")
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
