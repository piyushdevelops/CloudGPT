import json, pathlib, urllib.request, uuid
p = pathlib.Path(__file__).parent
t = json.loads((p / 'upload-target.json').read_text())
f = p / 'artwork/Home page limited edition image 1.png'
b = uuid.uuid4().hex
parts = []
for a in t['parameters']:
    parts.append(('--' + b + '\r\nContent-Disposition: form-data; name="' + a['name'] + '"\r\n\r\n' + a['value'] + '\r\n').encode())
parts.append(('--' + b + '\r\nContent-Disposition: form-data; name="file"; filename="june-limited-edition-hero-20260928.png"\r\nContent-Type: image/png\r\n\r\n').encode())
parts.extend([f.read_bytes(), ('\r\n--' + b + '--\r\n').encode()])
req = urllib.request.Request(t['url'], data=b''.join(parts), headers={'Content-Type': 'multipart/form-data; boundary=' + b}, method='POST')
with urllib.request.urlopen(req, timeout=60) as response:
    print(response.status)
(p / 'upload-target.json').unlink()
