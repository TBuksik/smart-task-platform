import chardet
import os

files = []
for root, dirs, filenames in os.walk("app"):
    for f in filenames:
        if f.endswith(".py"):
            files.append(os.path.join(root, f))

files.append("alembic/env.py")

for filepath in files:
    with open(filepath, "rb") as f:
        raw = f.read()
        result = chardet.detect(raw)
        if result["encoding"] not in ("utf-8", "ascii", "UTF-8-SIG"):
            print(f"PROBLEM: {filepath} -> {result}")
        else:
            print(f"OK: {filepath} -> {result['encoding']}")