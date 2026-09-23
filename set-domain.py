#!/usr/bin/env python3
"""Rewrite the production domain across SEO files. Usage:
  python3 set-domain.py https://yourdomain.com
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OLD = "https://nithilankarthik.com"

def main():
    if len(sys.argv) != 2 or not sys.argv[1].startswith("http"):
        print("Usage: python3 set-domain.py https://yourdomain.com")
        sys.exit(1)
    new = sys.argv[1].rstrip("/")
    files = list(ROOT.glob("*.html")) + [
        ROOT / "robots.txt",
        ROOT / "sitemap.xml",
        ROOT / "llms.txt",
        ROOT / "humans.txt",
        ROOT / "SITE_URL.txt",
    ]
    for path in files:
        if not path.exists():
            continue
        text = path.read_text()
        if OLD not in text:
            continue
        path.write_text(text.replace(OLD, new))
        print("updated", path.name)
    print("done:", new)

if __name__ == "__main__":
    main()
