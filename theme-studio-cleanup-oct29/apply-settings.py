from pathlib import Path
import json
import re

root = Path(__file__).resolve().parent / 'working'
section = root / 'sections' / 'june-photo-studio-page.liquid'
source = section.read_text(encoding='utf-8')
for exact in (
    '{"type":"product","id":"product","label":"Photo book product"},',
    '{"type":"textarea","id":"variant_map","label":"Draft product variant map","info":"Fallback used while the photo book product remains draft. One key=value pair per line."},',
):
    if source.count(exact) != 1:
        raise SystemExit(f'Expected one setting: {exact}')
    source = source.replace(exact, '', 1)
schema = source.split('{% schema %}', 1)[1].split('{% endschema %}', 1)[0]
json.loads(schema)
section.write_text(source, encoding='utf-8')

template = root / 'templates' / 'page.photo-book-studio.json'
source = template.read_text(encoding='utf-8')
for pattern in (r'^\s*"product": "june-photo-book",\n', r'^\s*"variant_map": ".*",\n'):
    source, count = re.subn(pattern, '\n', source, count=1, flags=re.MULTILINE)
    if count != 1:
        raise SystemExit(f'Expected one template setting: {pattern}')
json.loads(source[source.index('{', source.index('*/') + 2):])
template.write_text(source, encoding='utf-8')
