# Fantasy Basketball Public Demo — Preservation Baseline Report

**Repository:** `erturkeryavuz/fantasy-basketball-demo` (Public Showcase Only)  
**Verified Branch / HEAD:** `main` @ `c573508540f08d324b9456a341b553d53981a32c` (clean working tree prior to creating `planning/`)  
**Configured Remote:** `origin` → `git@github.com:erturkeryavuz/fantasy-basketball-demo.git`  
**Inspection Scope:** Read-only inspection of `README.md`, `docs/`, and `tests/verify_demo.py` (original private engineering repo intentionally unopened)

---

## 1. Verified Existing Features & Architecture

- **Zero-Dependency Static Architecture (`docs/`):** Plain HTML5 (`docs/index.html`, `6,121 B`), CSS3 (`docs/styles.css`, `30,295 B`, 1,509 lines), ES Modules (`docs/app.js`, `54,658 B`, 1,298 lines; `docs/data.js`, `11,655 B`, 366 lines), and `docs/.nojekyll`. Zero external runtime scripts, fonts, or CDNs.
- **Existing 8-Step Manual Guided Tour (`nav.tour-bar`):**
  - 8 numbered `.tour-pill` buttons (`1. Welcome`, `2. Home Menu`, `3. PackMarket`, `4. Open Pack`, `5. My Cards`, `6. Players Grid`, `7. Stephen Curry 3D Card`, `8. Teams`).
  - Clicking any pill switches `state.inspectorTab = "trace"` and invokes `navigate(...)` directly.
- **11 Faithful SwiftUI Mobile Screens (`#phoneBody` inside `.phone-bezel`):**
  - Pure iOS `NavigationStack` flow (no invented bottom tab bar): `welcome`, `login`, `register`, `home`, `teams`, `team-players`, `players` (4 live filters: position, country, team, minimum OVR + clear button), `player-detail` (3D tap-to-flip card with golden shine overlay on high-tier cards), `market` (3 pack tiers), `pack-detail` (animated pack opening via `handleOpenPack()` with spinner and `springPop` reveal), and `my-cards` (personal inventory reflecting opened cards).
- **3-Tab Engineering & API Inspector (`#panelTrace`, `#panelLeague`, `#panelArch`):**
  - `Live API Trace` (interactive selectable trace list recording simulated DRF routes, payloads, and permission classes).
  - `Backend-Only League Engine` (step-through via `BACKEND_LEAGUE_STEPS`, explicitly preserving the distinction that league endpoints are backend-only and not wired in SwiftUI).
  - `Architecture & Security` summary tab.
  - Supports `ArrowLeft` / `ArrowRight` keyboard tab switching and `#srAnnouncer` (`aria-live="assertive"`).
- **Session Controls (`header.topbar`):** `+1,000 Demo Credits`, `Reset Session`, and `GitHub Repository ↗` link.
- **Media & Licensing (`docs/assets/` — 14 Verified Files):**
  - 5 original SVGs (`basketball-logo.svg`, `teams/{fb,gsw,lal,phx}.svg`) + 9 CC-licensed Wikimedia Commons JPEGs (`court-bg.jpg`, `players/{booker,bronny,butler,curry,durant,guduric,lebron,nigel}.jpg`).
  - 100% attributed in `docs/THIRD-PARTY-NOTICES.md` and `docs/notices.html`.

---

## 2. Preservation Inventory (`PRESERVE` / `ENHANCE` / `ADD` / `FIX`)

| Component / Area | Classification | Evidence & Rationale |
|---|---|---|
| iOS phone bezel & all 11 SwiftUI screens (`docs/app.js`, `docs/styles.css` L398–1240) | **PRESERVE** | Source-faithful gradients, 3D card flip (`PlayerDetailView`), pack spinner & `springPop` reveal, 4-filter `PlayersView`, pure `NavigationStack`. Must not be simplified or recolored. |
| 8-step numbered `.tour-bar` manual jump pills (`docs/index.html` L49–59) | **PRESERVE** | Already provides fast, clear numbered manual navigation across key screens; tutorial layer must synchronize with and never replace it. |
| 3-tab Engineering Inspector (`Live API Trace`, `Backend-Only League Engine`, `Architecture & Security`) | **PRESERVE** | High engineering credibility, clear backend-only league boundary, keyboard arrow-tab support, live trace recording. |
| Topbar `+1,000 Demo Credits` and `Reset Session` controls | **PRESERVE** | Essential for hands-on manual testing of all pack tiers and session recovery. |
| All 14 sanitized visual assets & attribution docs (`docs/THIRD-PARTY-NOTICES.md`, `docs/notices.html`) | **PRESERVE** | Exact inventory locked by `tests/verify_demo.py`; full CC BY / CC BY-SA compliance. |
| Offline verification suite (`tests/verify_demo.py` — 8/8 passing) | **PRESERVE** | Fast (`0.23s`), zero-dependency gate guarding assets, attribution, secrets, and JS syntax. |
| Outer studio color tokens & background wash (`docs/styles.css` L6–95) | **ENHANCE** | Currently cold navy `#080a0f` / `#10141e` / `#161c2a` with sky-blue `#38bdf8` wash; selectively harmonize outer chrome to Portfolio V3 Obsidian `#101113` / Graphite `#1C1E22` / Warm Ivory `#F1EDE5` / Bronze `#B49A78` / Slate Teal `#758D92` while retaining basketball amber/orange and untouched inner phone screens. |
| Hero & topbar editorial copy (`docs/index.html` L21–47) | **ENHANCE** | `.sim-pill` and hero paragraph read defensively and list raw `.swift` filenames; tighten into confident, concise Portfolio V3 editorial copy while retaining clear attribution and non-affiliation links. |
| `Watch Tutorial` optional automated playback layer | **ADD** | Currently absent. Add user-initiated `Watch Tutorial` CTA + lightweight playback controller (`Play`, `Pause`, `Previous`, `Next`, `Restart`, `Exit / Explore Manually`, progress indicator, concise stage caption, automated real UI interactions like filtering, 3D card flip, and pack opening) driving existing `navigate()` / DOM actions without auto-starting. |
| Back-to-portfolio navigation link (`https://erturkeryavuz.netlify.app`) | **ADD** | Missing direct return link to the main Portfolio V3 site from header/footer. |
| Original README hero cover & Social Preview (`1280×640`) | **ADD** | `README.md` currently has no visual cover image; requires original dark editorial basketball artwork (separate authorization if generating new image assets). |
| Focused tutorial & playback automated tests | **ADD** | Add deterministic checks covering tutorial controls, state transitions, and manual-mode independence alongside existing `verify_demo.py`. |
| Unittest discovery naming (`tests/verify_demo.py`) | **FIX** | `python3 -m unittest discover -s tests` reports `0` tests because filename does not start with `test_` (running `python3 tests/verify_demo.py` directly executes all 8 tests). |

---

## 3. Current Visual Strengths & Specific Weaknesses

### Visual Strengths (Keep Intact)
- High-craft, immediately recognizable iOS phone presentation with faithful SwiftUI gradients, 3D flippable collectible card, golden shine sweep, and spring-animated pack reveal.
- Clean two-column desktop workspace pairing the interactive phone directly beside the synchronized Django REST API trace.
- Existing `prefers-reduced-motion` rules (`docs/styles.css` L1503) and accessible focus outlines.

### Concrete Visual Weaknesses (Targeted for Selective Enhancement)
1. **Outer studio palette mismatch with Portfolio V3:** Cold blue-dark surfaces (`#080a0f`, `#10141e`, `#161c2a`) and `#38bdf8` sky glow clash subtly with Portfolio V3's warm Obsidian/Graphite/Ivory/Bronze identity.
2. **Dense, verbose topbar & hero copy:** Topbar packs brand, long `.sim-pill` disclaimer, and 3 action buttons on one bar; hero paragraph lists 8 `.swift` view filenames inline, creating visual density before the phone even appears.
3. **No clear tutorial entry or playback guidance:** Visitors see 8 static tour pills with no obvious `Watch Tutorial` button, no guided narration explaining what is happening on screen, and no automated demonstration of key interactions (3D flip, player filters, pack opening).
4. **No README cover artwork:** `README.md` opens with plain text only, offering no visual preview of the app's card collection, phone screens, or PackMarket flow.

---

## 4. Existing Tests & Verification Gates

- **Command:** `python3 -B tests/verify_demo.py` → **`exit 0` (`Ran 8 tests in 0.232s — OK`)**
- **Verified checks:** Required files exist, exact 14-file `docs/assets/` inventory, 100% attribution coverage in `THIRD-PARTY-NOTICES.md` and `notices.html`, zero forbidden legacy directories (`backend`, `frontend`, root `assets`), zero secrets/local paths/private links across all repo text files, zero external CDN/script tags, all relative asset paths resolve, and `node --check` passes on `app.js` and `data.js`.
- **Important Gate Constraint:** Because `test_exact_sanitized_asset_inventory` enforces an exact set of 14 files inside `docs/assets/`, any future README cover artwork must either live outside `docs/assets/` (e.g., `media/` at repo root) or explicitly update both the asset list and attribution notices if placed in `docs/`.

---

## 5. Exact Files Likely to Change in Future Implementation

- **Milestone 1A (Tutorial Engine + Selective Outer-Studio Polish):**
  - `docs/index.html` (add `Watch Tutorial` CTA, compact tutorial playback bar/caption region, back-to-portfolio link, tightened hero copy; preserve `.tour-bar`, phone frame, and 3-tab inspector)
  - `docs/styles.css` (harmonize outer-studio tokens `#101113` / `#1C1E22` / `#F1EDE5` / `#758D92` / `#B49A78` + tutorial bar responsive & reduced-motion styles; leave SwiftUI screen styles intact)
  - `docs/app.js` (add self-contained deterministic tutorial state machine driving existing `navigate()`, filter updates, 3D card flip, `handleOpenPack()`, and inspector tab sync; keep manual mode 100% independent)
  - `tests/verify_demo.py` (preserve all 8 existing checks + add tutorial DOM/syntax/contract checks, and ensure `unittest discover` compatibility)
- **Milestone 1B (GitHub Cover Artwork — Separate Authorization):**
  - `media/` (new original README hero cover & `1280×640` Social Preview artwork outside `docs/assets/`)
  - `README.md` (embed new cover artwork)

---

## 6. Recommended First Implementation Milestone

**Milestone 1A — Fantasy Basketball Guided Tutorial & Portfolio V3 Outer-Studio Polish** (bounded, zero external assets/image generation needed):
1. Add the optional `Watch Tutorial` button and lightweight playback bar (`Play`, `Pause`, `Previous`, `Next`, `Restart`, `Exit / Explore Manually`, progress + concise stage narration) driving the real existing SwiftUI screens and interactions (`welcome` → `login` → `home` → `teams` → `players` with live filter → `player-detail` with 3D card flip → `market` → `pack-detail` with simulated pack opening → `my-cards` → `Live API Trace` / `Backend-Only League Engine` → complete/manual handoff).
2. Keep the existing 8-pill `.tour-bar` synchronized and 100% usable manually.
3. Selectively align outer studio tokens and hero/topbar typography to Portfolio V3 (`#101113`, `#1C1E22`, `#F1EDE5`, `#758D92`, `#B49A78`) + add a return link to `https://erturkeryavuz.netlify.app` while keeping all inner SwiftUI screens untouched.
4. Run `tests/verify_demo.py` + new tutorial checks + real desktop (`1440×900`), tablet (`768×1024`), and mobile (`390×844`) browser QA, then stop for owner review before commit/push/cover artwork.
