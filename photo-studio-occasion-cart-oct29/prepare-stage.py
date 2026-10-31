from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen
import json
import shutil
import time

root = Path(__file__).resolve().parent.parent
work = root / 'photo-studio-occasion-cart-oct29'
prior = root / 'photo-studio-newyork-oct29' / 'stage'
remote = work / 'remote'
stage = work / 'stage'
files = [path.relative_to(prior) for path in prior.rglob('*') if path.is_file()]
base = 'https://june-photo-studio-production.up.railway.app/'

def fetch(relative):
    url = base + quote(relative.as_posix()) + f'?reconcile={time.time_ns()}'
    with urlopen(url, timeout=30) as response:
        return relative, response.read()

with ThreadPoolExecutor(max_workers=8) as executor:
    fetched = list(executor.map(fetch, files))

drift = []
for relative, data in fetched:
    expected = (prior / relative).read_bytes()
    if data != expected:
        drift.append(relative.as_posix())
    for directory in (remote, stage):
        target = directory / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)

if drift:
    print('Remote drift detected:', json.dumps(drift))
    raise SystemExit(2)

for name in ('app.js', 'index.html'):
    shutil.copyfile(root / 'photobook-studio-mvp' / name, stage / name)

manifest = [{'file': path.as_posix(), 'sha256': sha256((stage / path).read_bytes()).hexdigest()} for path in files]
(work / 'stage-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(f'Remote matched prior production stage: {len(files)} files; staged 2 intended changes')
