# Fantasy Basketball

[![Fantasy Basketball — SwiftUI iOS and Django REST basketball card and roster application](media/fantasy-basketball-readme-hero.png)](https://erturkeryavuz.github.io/fantasy-basketball-demo/)

**Live Interactive Demo:** [https://erturkeryavuz.github.io/fantasy-basketball-demo/](https://erturkeryavuz.github.io/fantasy-basketball-demo/)

Fantasy Basketball is a full-stack collectible basketball card and roster-management application built with **SwiftUI** and **Django REST Framework** as a B.Sc. Computer Engineering graduation project at Maltepe University by **Ertürk Eryavuz**.

The live GitHub Pages site provides an interactive browser preview of the mobile interface alongside a technical inspector mapping each screen to its corresponding Django REST Framework endpoint, authorization rule, and serializer payload.

## Core Features

- **Collectible Player Cards & 3D Flip:** Six rarity tiers (`Gold`, `Ruby`, `Amethyst`, `Diamond`, `Pink Diamond`, `Dark Blue Diamond`) with tier-specific gradients and a 180° tap-to-flip card detail view revealing best skill and physical attributes.
- **PackMarket & Weighted Drops:** Purchase `Gold` (`500`), `Amethyst` (`800`), or `Diamond` (`1,000`) packs using session credits, triggering a pack-opening animation and weighted rarity roll (`POST /api/open-pack/`).
- **Club Rosters & Multi-Filter Directory:** Browse four basketball clubs, inspect club rosters, and filter players by position, nationality, team, and minimum overall rating.
- **Personal Collection (`My Cards`):** View acquired cards in an owned collection screen synced with `/api/my-cards/`.
- **Backend League Engine (REST API):** Implements relational models (`League`, `UserLeague`, `UserLeaguePlayer`, `Match`, `PlayerStats`, `TeamStats`) and REST endpoints for joining 10-player leagues, generating round-robin schedules, recording match results, and computing standings. These league endpoints are backend-only in Django DRF and are not wired into the SwiftUI mobile screens.

## Technology Stack

- **Original iOS Client:** Native SwiftUI (`NavigationStack`), token-authenticated `APIService`
- **Original Backend:** Django 5, Django REST Framework, `django-filter`, SQLite
- **Browser Preview:** Vanilla HTML, CSS, and ES Modules (`docs/`) with zero external runtime dependencies

## Architecture & Engineering Notes

- **Authorization Boundaries:** Enforces `IsAdminOrReadOnly` on club and player catalogs, `IsAuthenticated` on user profiles, card collections, and pack openings, and `IsAdminUser` on league schedule generation and match result recording.
- **Atomic Pack Openings:** `OpenCardPackView` validates credits, deducts balance, rolls weighted rarity odds, and creates `UserCard` records atomically.
- **Backend Configuration:** Uses environment-only `DJANGO_SECRET_KEY` (failing closed when `DEBUG=False`) and an explicit CORS allowlist. Under SQLite, conditional atomic updates protect balances under the database write lock; PostgreSQL is recommended for multi-worker concurrency.

## Exploring the Browser Preview

- **Direct Mobile Navigation:** Interact directly with the iOS phone frame or jump between views using the eight screen shortcuts above the workspace.
- **Watch Tutorial:** Launch the optional 10-stage guided walkthrough with play/pause, previous/next stepping, restart, responsive viewport fitting, keyboard support, and reduced-motion handling.
- **Technical Inspector:** Switch between **Live API Trace**, **Backend-Only League Engine**, and **Architecture & Security** to inspect simulated DRF requests, serializer payloads, and backend-only league endpoints.

## Data Provenance & Preview Scope

- **Source Availability:** The original full-stack Django and SwiftUI engineering repository is private. This public repository contains the standalone static browser preview (`docs/`), media attribution notices, and offline verification checks.
- **Offline Simulation:** The browser preview runs completely client-side with no live backend, no database connection, no real user accounts, no credentials, and no external network requests.
- **Player Dataset:** Preserves the project's four clubs and eight players. Stephen Curry's attributes (`97 OVR`, `Dark Blue Diamond`) match `PlayerDetailView.swift` verbatim; ratings and bios for the other seven players are illustrative values aligned to `PlayerSerializer` and rarity thresholds — **not** official NBA or EuroLeague statistics.
- **Affiliation:** Fantasy Basketball is an independent, unmonetized academic and portfolio project and is not affiliated with, endorsed by, or sponsored by the NBA, EuroLeague, any basketball club, or any athlete.

## Media Licensing & Attribution

All 14 visual assets in `docs/assets/` are either original vector graphics authored for this repository (5 SVGs: app emblem and 4 geometric club badges) or cropped/resized derivatives of openly licensed Wikimedia Commons photographs (9 JPEGs under `CC BY 2.0/4.0` or `CC BY-SA 2.0/4.0`). Repository cover artwork in `media/` and editable vector sources in `media/src/` are original vector graphics with no third-party photographs, athlete likenesses, or league/club trademarks.

- Full attribution table: [docs/THIRD-PARTY-NOTICES.md](docs/THIRD-PARTY-NOTICES.md)
- Live notices page: [https://erturkeryavuz.github.io/fantasy-basketball-demo/notices.html](https://erturkeryavuz.github.io/fantasy-basketball-demo/notices.html)

## Local Preview & Verification

```bash
# Run offline safety, asset, and tutorial verification suites
python3 tests/verify_demo.py
python3 -m unittest discover -s tests -v

# Serve the static preview locally
python3 -m http.server 8080 --directory docs
# Open http://127.0.0.1:8080/
```
