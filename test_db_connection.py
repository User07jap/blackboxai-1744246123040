from inventory_scanner.db import Database

try:
    db = Database()
    print("Database connection successful!")
    cursor = db.connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    print("Existing tables:", cursor.fetchall())
    cursor.close()
except Exception as e:
    print("Database connection failed:", str(e))
