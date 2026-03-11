import os

s = "postgresql+psycopg2://taskuser:taskpassword@localhost:5432/taskdb?sslmode=disable"
print(f"Dlugosc: {len(s)}")
if len(s) > 92:
    print(f"Znak na pozycji 92: {repr(s[92])}")
else:
    print("String za krotki")

paths = [
    os.path.expanduser("~/.pgpass"),
    os.path.expanduser("~/AppData/Roaming/postgresql/pgpass.conf"),
    "C:/Users/timok/AppData/Roaming/postgresql/pgpass.conf",
]
for p in paths:
    exists = os.path.exists(p)
    print(f"{p}: {'ISTNIEJE' if exists else 'brak'}")