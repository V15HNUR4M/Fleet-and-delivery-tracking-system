with open("scripts/make_doc_parts.py", "r", encoding="utf-8") as f:
    parts_code = f.read()

prefix = 'HTML_START = """<!DOCTYPE html>'
start_idx = parts_code.find(prefix)
end_idx = parts_code.find('print("Part 1 base CSS written.")')
html_start = parts_code[start_idx:end_idx].strip()

with open("scripts/build_full_doc.py", "r", encoding="utf-8") as f:
    full_code = f.read()

new_code = html_start + "\n\n" + full_code
with open("scripts/build_full_doc.py", "w", encoding="utf-8") as f:
    f.write(new_code)

print("Prepended HTML_START successfully!")
