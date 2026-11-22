"""Standalone offline security, attribution, link, and syntax verification for fantasy-basketball-demo."""

import os
import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

EXPECTED_ASSETS = {
    "assets/basketball-logo.svg",
    "assets/court-bg.jpg",
    "assets/teams/fb.svg",
    "assets/teams/gsw.svg",
    "assets/teams/lal.svg",
    "assets/teams/phx.svg",
    "assets/players/booker.jpg",
    "assets/players/bronny.jpg",
    "assets/players/butler.jpg",
    "assets/players/curry.jpg",
    "assets/players/durant.jpg",
    "assets/players/guduric.jpg",
    "assets/players/lebron.jpg",
    "assets/players/nigel.jpg",
}

FORBIDDEN_PATTERNS = [
    ("local_user_path", re.compile(r"/Users/[A-Za-z0-9._-]+")),
    ("django_insecure", re.compile(r"django-insecure-")),
    ("private_key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("old_private_repo_link", re.compile(r"github\.com/erturkeryavuz/fantasy-basketball(?![/-]demo)")),
    ("old_private_pages_link", re.compile(r"erturkeryavuz\.github\.io/fantasy-basketball(?!/|-demo)")),
    ("legacy_media_ref", re.compile(r"backend/media/|Assets\.xcassets|Los_Angeles_Lakers_logo|goldenstatelolo|fenerbah")),
]


class FantasyBasketballDemoTests(unittest.TestCase):
    def test_required_files_exist(self):
        for rel in ["README.md", "docs/.nojekyll", "docs/index.html", "docs/notices.html", "docs/styles.css", "docs/app.js", "docs/data.js", "docs/THIRD-PARTY-NOTICES.md"]:
            self.assertTrue((ROOT / rel).is_file(), f"Missing required file: {rel}")

    def test_exact_sanitized_asset_inventory(self):
        actual = {
            p.relative_to(DOCS).as_posix()
            for p in (DOCS / "assets").rglob("*")
            if p.is_file() and p.name != ".DS_Store"
        }
        self.assertEqual(actual, EXPECTED_ASSETS)

    def test_all_assets_attributed_in_notices(self):
        notices_md = (DOCS / "THIRD-PARTY-NOTICES.md").read_text(encoding="utf-8")
        notices_html = (DOCS / "notices.html").read_text(encoding="utf-8")
        for asset in EXPECTED_ASSETS:
            self.assertIn(f"docs/{asset}", notices_md, f"Missing in THIRD-PARTY-NOTICES.md: {asset}")
            self.assertIn(asset, notices_html, f"Missing in notices.html: {asset}")

    def test_no_private_source_or_legacy_directories(self):
        for forbidden_dir in ["backend", "frontend", "assets"]:
            self.assertFalse((ROOT / forbidden_dir).exists(), f"Forbidden directory present: {forbidden_dir}")

    def test_zero_secrets_paths_or_stale_private_links(self):
        for p in ROOT.rglob("*"):
            if not p.is_file() or ".git" in p.parts or p == Path(__file__).resolve():
                continue
            if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
                continue
            text = p.read_text(encoding="utf-8", errors="replace")
            for label, pat in FORBIDDEN_PATTERNS:
                self.assertIsNone(pat.search(text), f"Forbidden pattern '{label}' matched in {p.relative_to(ROOT)}")

    def test_no_external_runtime_scripts_or_cdns_in_html(self):
        for fn in ["index.html", "notices.html"]:
            html = (DOCS / fn).read_text(encoding="utf-8")
            self.assertNotIn("fonts.googleapis.com", html)
            self.assertNotIn("cdn.nba.com", html)
            self.assertNotRegex(html, r'<script[^>]+src="https?://')

    def test_relative_asset_references_resolve(self):
        for fn in ["index.html", "notices.html", "data.js", "app.js"]:
            txt = (DOCS / fn).read_text(encoding="utf-8")
            for ref in re.findall(r"(?:assets/[A-Za-z0-9_./-]+\.(?:svg|jpg|jpeg|png))", txt):
                self.assertTrue((DOCS / ref).is_file(), f"Broken asset ref '{ref}' in {fn}")

    def test_js_syntax_valid(self):
        node = subprocess.run(["which", "node"], capture_output=True, text=True).stdout.strip()
        if not node:
            self.skipTest("node not installed")
        for js in ["app.js", "data.js"]:
            r = subprocess.run([node, "--check", str(DOCS / js)], capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, f"JS syntax error in {js}: {r.stderr}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
