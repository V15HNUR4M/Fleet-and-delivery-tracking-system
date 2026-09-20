import re

with open('docs/frontend/documentation.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Split by class="page"
pages = content.split('<div class="page"')
print(f"Total page chunks: {len(pages) - 1}")

for i, p in enumerate(pages[1:], 1):
    super_m = re.search(r'<div class="doc-super">([^<]+)</div>', p)
    title_m = re.search(r'<div class="doc-title">([^<]+)</div>', p)
    sub_m = re.search(r'<div class="doc-sub">([^<]+)</div>', p)
    purpose_m = re.search(r'<div class="purpose-text">', p)
    
    s = super_m.group(1).strip() if super_m else ''
    t = title_m.group(1).strip() if title_m else ''
    sub = sub_m.group(1).strip() if sub_m else ''
    has_p = 'YES' if purpose_m else 'no'
    
    # Check if cover page
    if 'cover-container' in p or 'APPLICATION DEVELOPMENT' in p:
        print(f"P{i:02d}: [COVER PAGE]")
    elif 'FOLDER STRUCTURE' in p:
        print(f"P{i:02d}: [FOLDER STRUCTURE] {s} | {t}")
    else:
        print(f"P{i:02d}: [{s}] | [{t}] | [{sub}] | purpose={has_p}")
