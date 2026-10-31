from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen
import time

snapshot = Path(__file__).resolve().parent / 'remote'
files = [path.relative_to(snapshot) for path in snapshot.rglob('*') if path.is_file()]
base = 'https://june-photo-studio-production.up.railway.app/'

def check(relative):
    url = base + quote(relative.as_posix()) + f'?recheck={time.time_ns()}'
    with urlopen(url, timeout=30) as response:
        return relative.as_posix(), response.read() == (snapshot / relative).read_bytes()

with ThreadPoolExecutor(max_workers=8) as executor:
    results = list(executor.map(check, files))
changed = [name for name, equal in results if not equal]
print(f'Fresh remote recheck: {len(results) - len(changed)}/{len(results)} exact; changed: {changed}')
if changed:
    raise SystemExit(2)
