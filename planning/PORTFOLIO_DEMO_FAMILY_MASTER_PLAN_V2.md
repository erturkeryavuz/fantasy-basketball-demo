# Portfolio Demo Family — Master Plan V2
## Preservation-First Enhancement, Guided Tutorials & Shared Visual Identity

**Program Owner:** Ertürk Eryavuz  
**Status:** Preparation Baseline Established (Quota-Aware Checkpoint)  
**Cost Constraint:** $0 USD / 0 TRY incremental cost across the entire program  
**Reference Visual Direction:** Portfolio V3 — **70% Minimal Developer + 30% Cinematic Editorial**

---

## 1. Program Scope & Execution Sequence

### Excluded (Active Engineering Projects — Do Not Modify)
- `QUO` (`quo-conductor-demo`)
- `RAG Platform` (`rag-evidence-desk-demo`)
- `AI Enterprise Automation` (`aiea-ledger-demo`)

These remain active projects. Their guided experiences may serve only as conceptual references; do not modify their repositories, demos, or assets during this program.

### Included (Completed Public Showcase Repositories Only — Strict Sequential Order)
Work on **one project at a time**, stopping for owner review between milestones:

1. **Fantasy Basketball** (`erturkeryavuz/fantasy-basketball-demo`) — *First target*
2. **Euro2024App** (`erturkeryavuz/euro2024app-demo`)
3. **TSLAIQ** (`erturkeryavuz/tslaiq-demo`)
4. **NBASHOP** (`erturkeryavuz/nbashop-demo`)
5. **Trading Edge Terminal** (`erturkeryavuz/trading-edge-terminal-demo`)
6. **GoSil** (`erturkeryavuz/gosil-analytics-demo`)

**Hard Repository Boundary:** Only dedicated public showcase repositories are eligible for changes. Never modify original private engineering repositories, reopen frozen milestones, or add backend services, hosted AI inference, APIs, accounts, or paid infrastructure.

---

## 2. Preservation-First Development Principles

Apply this strict priority order to every design and engineering decision:

1. Preserve correct existing behavior.
2. Preserve high-quality existing visual and interaction design.
3. Fix concrete defects only when supported by evidence.
4. Add missing capabilities without disturbing the existing experience.
5. Improve clearly weaker visual elements.
6. Introduce shared design standards only where they genuinely improve consistency.
7. Avoid unnecessary refactoring and architectural rewrites.

Before modifying any demo, classify every existing feature as **`PRESERVE`**, **`ENHANCE`**, **`ADD`**, or **`FIX`**. Never replace `PRESERVE` components merely for uniformity.

---

## 3. Shared Visual Identity & Project Individuality

### Portfolio V3 Foundation Palette
- **Obsidian:** `#101113`
- **Graphite:** `#1C1E22`
- **Warm Ivory:** `#F1EDE5`
- **Muted Slate Teal:** `#758D92`
- **Restrained Bronze:** `#B49A78`

### Family Standards
- Outer studio framing shares the Obsidian/Graphite/Warm Ivory editorial discipline, typography hierarchy, refined button/focus states, keyboard accessibility, reduced-motion support, and clear navigation back to the main portfolio (`https://erturkeryavuz.netlify.app`).
- **Project Individuality Protected:** Each project retains its domain accents (e.g., basketball amber/orange in Fantasy Basketball, football palette in Euro2024App, charting aesthetics in TSLAIQ/TET/GoSil, storefront personality in NBASHOP) and its native interaction model. Never turn mobile app showcases into generic dashboards or flatten all six demos into identical templates.

---

## 4. Shared Guided Tutorial Behavior Contract

Every completed demo will support an optional, user-initiated guided walkthrough layer over its **actual existing UI and state transitions**:

- **Entry:** Visible `Watch Tutorial` CTA on landing; never auto-starts without user action.
- **Playback Controls:** `Play`, `Pause`, `Previous`, `Next`, `Restart`, `Exit / Explore Manually`.
- **Clarity & Synchronization:** Visible step progress, concise stage narration, automatic real UI interactions (not disconnected slide decks), and full synchronization with any existing step/screen indicators.
- **Independence:** Manual exploration works identically before, during (after exit), and after tutorial completion.
- **Technical Guarantees:** Deterministic, lightweight, zero external libraries/video players/analytics/remote calls, keyboard accessible, responsive across desktop/tablet/mobile, and `prefers-reduced-motion` compatible.

---

## 5. Fantasy Basketball Target Storyboard (Adapted to Verified Screens)

1. **Introduction / Welcome** (`welcome` — `ContentView.swift` launch experience)
2. **Authentication Preview** (`login` — demo token login flow, no real auth)
3. **Home Menu** (`home` — `HomeView.swift` navigation hub & credits overview)
4. **Teams & Rosters** (`teams` / `team-players` — 4 teams with original geometric club badges)
5. **Player Directory & Filtering** (`players` — 4-filter SwiftUI filter bar demonstration)
6. **3D Collectible Player Card** (`player-detail` — Stephen Curry card + tap-to-flip interaction)
7. **PackMarket Overview** (`market` — 3 pack tiers & rarity odds)
8. **Pack Opening Interaction** (`pack-detail` — deterministic simulated `POST /api/open-pack/` reveal)
9. **My Cards Collection** (`my-cards` — newly opened card reflected in personal inventory)
10. **Engineering & API Inspector** (`#panelTrace` / `#panelLeague` — synchronized DRF trace + explicit backend-only league boundary)
11. **Finish & Explore Manually** (coherent final state with `Replay Tutorial` and `Explore Manually` actions)

---

## 6. Cover Image & GitHub Surfaces Strategy (Fantasy Basketball)

Replace weak single-screen imagery with an original, editorial basketball cover composition combining dark cinematic atmosphere, player-card depth, balanced mobile screens, restrained bronze + basketball-orange accents, and crisp typography — strictly using authorized/original demo assets (zero unlicensed photos, league logos, or commercial trademarks; preserve all CC attribution obligations).

Distinguish the three separate GitHub surfaces:
1. **Demo Repository `README.md` Hero Cover** (authored in this repo during an authorized artwork milestone).
2. **Demo Repository Social Preview** (`1280×640` asset uploaded by owner or authorized workflow in repo Settings).
3. **GitHub Profile README Showcase** (explicitly excluded from this milestone; do not edit the profile repo without separate authorization).

---

## 7. Safety, Attribution & Verification Gates

### Hard Constraints
- Zero modifications to original private engineering repositories.
- Zero external runtime scripts, paid services, hosted APIs, or tracking cookies.
- Preserve all Creative Commons attribution tables (`THIRD-PARTY-NOTICES.md` and `notices.html`) and unaffiliated disclaimers.
- Never weaken or delete existing verification tests; never run destructive Git operations; never interfere with unrelated running processes.

### Required Implementation Gates (For Future Authorized Milestones)
1. Existing functionality and manual navigation preserved with zero regressions.
2. Existing offline tests (`tests/verify_demo.py`) passing 100% + new focused tutorial tests passing.
3. Full tutorial playback contract verified (`Watch Tutorial`, `Play`, `Pause`, `Previous`, `Next`, `Restart`, `Exit`).
4. Real-browser desktop, tablet, and mobile QA (`0` console errors, `0` unintended overflow, `0` external network calls).
5. Keyboard accessibility and `prefers-reduced-motion` verified.
6. Privacy, secrets, private-link, and media-licensing checks passing.
7. Separate owner authorization required before any commit, push, or GitHub Pages deployment.

---

## 8. Current Quota Checkpoint & Next Authorization Boundary

- **Current Checkpoint:** Preparation phase complete (`fantasy-basketball-demo` inspected read-only; master plan and baseline documented outside `docs/`).
- **Not Yet Authorized:** No edits to `docs/`, `tests/`, `README.md`, or artwork; no commits, pushes, or deployments.
- **Next Authorization Required:** Explicit owner approval to execute **Milestone 1** (Fantasy Basketball `Watch Tutorial` guided layer + selective Portfolio V3 outer-studio polish + tests & browser QA). Artwork generation/cover replacement may be authorized alongside or as Milestone 1B.
