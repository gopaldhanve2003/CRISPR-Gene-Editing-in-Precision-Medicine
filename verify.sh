#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "[1/3] Checking JavaScript syntax..."
node --check script.js

echo "[2/3] Verifying required assets referenced by index.html..."
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
import re

html = Path('index.html').read_text(encoding='utf-8')

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('href', 'src'):
            if key in attrs:
                self.urls.append(attrs[key])

parser = Parser()
parser.feed(html)

local_assets = [u for u in parser.urls if u and not re.match(r'^(https?:)?//|#', u)]
missing = [u for u in local_assets if not Path(u).exists()]

if missing:
    raise SystemExit(f"Missing local assets: {missing}")

print(f"Validated {len(local_assets)} local asset reference(s): {local_assets}")
PY

echo "[3/3] Verifying local HTTP serving..."
python3 -m http.server 8000 >/tmp/verify_server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT
sleep 1
curl -fsSI http://127.0.0.1:8000/index.html >/dev/null

echo "All checks passed."
