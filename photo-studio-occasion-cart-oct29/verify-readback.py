from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen
import json
import time

work = Path(__file__).resolve().parent
stage = work / 'stage'
readback = work / 'readback'
files = [path.relative_to(stage) for path in stage.rglob('*') if path.is_file()]
base = 'https://june-photo-studio-production.up.railway.app/'

def fetch(relative):
    url = base + quote(relative.as_posix()) + f'?readback={time.time_ns()}'
    with urlopen(url, timeout=30) as response:
        return relative, response.read()

with ThreadPoolExecutor(max_workers=8) as executor:
    fetched = list(executor.map(fetch, files))

results = []
for relative, data in fetched:
    target = readback / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    results.append({'file': relative.as_posix(), 'exact': data == (stage / relative).read_bytes(), 'sha256': sha256(data).hexdigest()})

(work / 'final-readback.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
failed = [result['file'] for result in results if not result['exact']]
print(f'Production exact readback: {len(results) - len(failed)}/{len(results)}; mismatches: {failed}')
if failed:
    raise SystemExit(2)
