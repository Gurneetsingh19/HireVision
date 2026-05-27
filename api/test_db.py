from database import client

try:
    client.list_database_names()
    print("Connected")
except Exception as e:
    print(f"Connection failed: {e}")
