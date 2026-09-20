import os
import sys

out_file = os.path.join("docs", "frontend", "documentation.html")
os.makedirs(os.path.dirname(out_file), exist_ok=True)

with open(out_file, "w", encoding="utf-8") as f:
    f.write("<!-- FleetOps Complete Frontend Documentation HTML -->\n")

print(f"Initialized {out_file}")
