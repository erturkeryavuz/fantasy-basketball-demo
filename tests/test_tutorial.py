"""Focused behavioral tests for the optional Watch Tutorial layer in fantasy-basketball-demo.

Exercises real docs/app.js ESM execution against a deterministic in-memory DOM and fake timer clock
using Node.js (zero external dependencies), plus HTML contract assertions.
"""

import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

NODE_HARNESS = r"""
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const docsDir = process.argv[1];
const reduceMotionFlag = process.argv[2] === "reduce";

// Deterministic fake timer clock
let nowMs = 0;
let nextTimerId = 1;
const timers = new Map();

globalThis.window = globalThis;
window.setTimeout = (fn, delay = 0) => {
  const id = nextTimerId++;
  timers.set(id, { id, fn, runAt: nowMs + Math.max(0, Number(delay) || 0) });
  return id;
};
window.clearTimeout = (id) => {
  timers.delete(id);
};
window.requestAnimationFrame = (fn) => { fn(); return 1; };
window.matchMedia = (q) => ({
  matches: q.includes("prefers-reduced-motion") ? reduceMotionFlag : false,
  media: q,
});

function advanceTimers(ms) {
  const target = nowMs + ms;
  while (true) {
    let earliest = null;
    for (const t of timers.values()) {
      if (t.runAt <= target && (!earliest || t.runAt < earliest.runAt || (t.runAt === earliest.runAt && t.id < earliest.id))) {
        earliest = t;
      }
    }
    if (!earliest) break;
    timers.delete(earliest.id);
    nowMs = earliest.runAt;
    earliest.fn();
  }
  nowMs = target;
}

// Lightweight DOM element shim supporting querySelectorAll, dataset, classList, events, attributes
class FakeElement {
  constructor(tag, id = "", attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.attrs = { ...attrs };
    this.dataset = {};
    this.hidden = Boolean(attrs.hidden);
    this.disabled = false;
    this.textContent = "";
    this.innerHTML = "";
    this.value = "";
    this.style = {};
    this.listeners = new Map();
    this._classes = new Set((attrs.class || "").split(/\s+/).filter(Boolean));
    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("data-")) {
        const camel = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        this.dataset[camel] = v;
      }
    }
    this.classList = {
      add: (c) => this._classes.add(c),
      remove: (c) => this._classes.delete(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (force) this._classes.add(c);
        else this._classes.delete(c);
      },
      contains: (c) => this._classes.has(c),
    };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    // Dynamic controls like btnBuyPack get re-bound on every render() in app.js;
    // in a real browser DOM replacement removes old listeners, so mirror that for dynamic buttons.
    if (this.id === "btnBuyPack") {
      this.listeners.set(type, [fn]);
    } else {
      this.listeners.get(type).push(fn);
    }
  }
  click() {
    if (this.disabled) return;
    for (const fn of this.listeners.get("click") || []) fn({ target: this, preventDefault() {} });
  }
  dispatch(type, evt = {}) {
    for (const fn of this.listeners.get(type) || []) fn({ target: this, preventDefault() {}, ...evt });
  }
  focus() { document.activeElement = this; }
  querySelectorAll() { return []; }
}

const byId = new Map();
function makeEl(tag, id, attrs = {}) {
  const el = new FakeElement(tag, id, attrs);
  if (id) byId.set(id, el);
  return el;
}

const tourKeys = ["welcome", "home", "market", "pack-diamond", "my-cards", "players", "player-card", "teams"];
const tourPills = tourKeys.map((k) => new FakeElement("button", "", { class: "tour-pill", "data-tour": k }));
const inspectorTabs = ["trace", "league", "arch"].map((k) =>
  new FakeElement("button", `tab_${k}`, { class: "inspector-tab", "data-inspector": k })
);

// Core existing elements + tutorial elements
for (const [tag, id, attrs] of [
  ["div", "phoneBody", {}],
  ["div", "iosStatusbar", {}],
  ["div", "homeIndicator", {}],
  ["div", "panelTrace", {}],
  ["div", "panelLeague", { hidden: true }],
  ["div", "panelArch", { hidden: true }],
  ["div", "srAnnouncer", {}],
  ["button", "btnAddCredits", {}],
  ["button", "btnResetDemo", {}],
  ["button", "btnWatchTutorial", {}],
  ["section", "tutorialDock", { hidden: true }],
  ["span", "tutorialStepBadge", {}],
  ["span", "tutorialStateBadge", {}],
  ["h2", "tutorialStageTitle", {}],
  ["div", "tutorialProgress", {}],
  ["div", "tutorialProgressFill", {}],
  ["p", "tutorialNarration", {}],
  ["button", "btnTutPrev", {}],
  ["button", "btnTutPlayPause", {}],
  ["button", "btnTutNext", {}],
  ["button", "btnTutRestart", {}],
  ["button", "btnTutExit", {}],
  ["button", "btnBuyPack", {}],
]) {
  makeEl(tag, id, attrs);
}

const docListeners = new Map();
globalThis.document = {
  activeElement: null,
  getElementById: (id) => byId.get(id) || null,
  querySelectorAll: (sel) => {
    if (sel === ".tour-pill") return tourPills;
    if (sel === ".inspector-tab") return inspectorTabs;
    return [];
  },
  addEventListener: (type, fn) => {
    if (!docListeners.has(type)) docListeners.set(type, []);
    docListeners.get(type).push(fn);
  },
  dispatch: (type, evt) => {
    for (const fn of docListeners.get(type) || []) fn(evt);
  },
};

const appUrl = pathToFileURL(path.join(docsDir, "app.js")).href;
await import(appUrl);

const api = window.__FB_TUTORIAL__;
const results = {};

// 1. Landing state (must NOT autoplay)
results.initial = {
  state: api.getState(),
  dockHidden: byId.get("tutorialDock").hidden,
  activeTimers: timers.size,
  stageCount: api.stages.length,
  stageTourKeysValid: api.stages.every((s) => tourKeys.includes(s.tourKey)),
};

// 2. Start Watch Tutorial & advance through full 10-stage playback
byId.get("btnWatchTutorial").click();
results.afterStart = {
  state: api.getState(),
  dockHidden: byId.get("tutorialDock").hidden,
  prevDisabled: byId.get("btnTutPrev").disabled,
  nextDisabled: byId.get("btnTutNext").disabled,
  playPauseText: byId.get("btnTutPlayPause").textContent,
};

// Advance step-by-step and capture key interactive stages
const seenStages = [api.getState().stageId];
const snapshots = {};
for (let i = 0; i < 60; i++) {
  advanceTimers(1000);
  const st = api.getState();
  if (seenStages[seenStages.length - 1] !== st.stageId) {
    seenStages.push(st.stageId);
  }
  if (st.stageId === "players-filter" && st.filters.position === "Guard") {
    snapshots.playersFiltered = { ...st.filters, matching: st.filteredPlayersCount };
  }
  if (st.stageId === "player-flip" && st.isCardFlipped) {
    snapshots.cardFlipped = true;
  }
  if (st.stageId === "pack-open" && st.myCardsCount > 0) {
    snapshots.packOpened = { myCardsCount: st.myCardsCount, credits: st.credits };
  }
  if (st.stageId === "inspector" && st.inspectorTab === "league") {
    snapshots.inspectorLeague = true;
  }
  if (st.completed) break;
}
results.fullPlaythrough = {
  seenStages,
  snapshots,
  endState: api.getState(),
  activeTimersAtEnd: timers.size,
  nextDisabledAtEnd: byId.get("btnTutNext").disabled,
  playPauseTextAtEnd: byId.get("btnTutPlayPause").textContent,
};

// 3. Restart from finish, then test Next, Prev, Pause (verify no auto-advance), Resume
byId.get("btnTutRestart").click();
const afterRestart = api.getState();
byId.get("btnTutNext").click(); // stage 1 (paused since Next stops auto-advance)
const afterNext = api.getState();
byId.get("btnTutPrev").click(); // back to stage 0
const afterPrev = api.getState();
byId.get("btnTutPlayPause").click(); // Resume -> Playing
const afterResume = api.getState();
byId.get("btnTutPlayPause").click(); // Pause
const afterPause = api.getState();
const timersWhilePaused = timers.size;
advanceTimers(60000);
const afterPauseWait = api.getState();

results.controls = {
  afterRestart,
  afterNext,
  afterPrev,
  afterResume,
  afterPause,
  timersWhilePaused,
  stayedPausedAfter60s: afterPauseWait.stageIndex === afterPause.stageIndex && !afterPauseWait.playing,
};

// 4. Repeated Watch Tutorial clicks safety (single active run, zero timer accumulation)
byId.get("btnWatchTutorial").click();
byId.get("btnWatchTutorial").click();
byId.get("btnWatchTutorial").click();
results.repeatedStartTimers = timers.size;

// 5. Exit cleans up all timers & hides dock; advancing clock changes nothing
byId.get("btnTutExit").click();
const afterExit = api.getState();
const timersAfterExit = timers.size;
const dockHiddenAfterExit = byId.get("tutorialDock").hidden;
advanceTimers(30000);
const afterExitWait = api.getState();
results.exit = {
  afterExit,
  timersAfterExit,
  dockHiddenAfterExit,
  noMutationsAfterExit: afterExitWait.screen === afterExit.screen && !afterExitWait.active,
};

// 6. Manual tour pill during active playback exits cleanly & stays independent
byId.get("btnWatchTutorial").click();
tourPills[2].click(); // "market"
const afterManualPill = api.getState();
const timersAfterManualPill = timers.size;
tourPills[7].click(); // "teams"
const afterSecondManualPill = api.getState();
results.manualIndependence = {
  afterManualPill,
  timersAfterManualPill,
  afterSecondManualPill,
  teamsPillActive: tourPills[7].classList.contains("active"),
};

// 7. Reset Session & Add Credits preserved
byId.get("btnWatchTutorial").click();
byId.get("btnAddCredits").click();
const creditsAfterAdd = api.getState().credits;
byId.get("btnResetDemo").click();
const afterReset = api.getState();
results.sessionControls = {
  creditsAfterAdd,
  afterReset,
  timersAfterReset: timers.size,
};

// 8. Escape key exits tutorial cleanly
byId.get("btnWatchTutorial").click();
document.dispatch("keydown", { key: "Escape" });
results.escapeExit = {
  active: api.getState().active,
  timers: timers.size,
};

// ==================== REGRESSION HARNESS (DEFECT A & DEFECT B) ====================
const reg = {};

// R1 & R2 & R5: Pause during 780ms pack-reveal interval, verify settled state, then Resume with extra credits (no double open/deduction/duplicate card)
byId.get("btnResetDemo").click();
byId.get("btnWatchTutorial").click();
// Step to stage 6 (pack-open) paused, add +1,000 extra credits so a buggy second open COULD afford another Diamond pack, then Play
for (let i = 0; i < 6; i++) byId.get("btnTutNext").click();
byId.get("btnAddCredits").click(); // credits now 2000
byId.get("btnTutPlayPause").click(); // Resume -> playing on pack-open
advanceTimers(1200); // 1100ms subAction fired handleOpenPack(); now 100ms into 780ms reveal interval
const midSpinBeforePause = api.getState();
byId.get("btnTutPlayPause").click(); // Pause mid-reveal!
const afterPauseMidReveal = api.getState();
const timersAfterPauseMidReveal = timers.size;
byId.get("btnTutPlayPause").click(); // Resume after interrupted pack animation!
advanceTimers(5000); // Allow stage timer to finish and advance to my-cards
const afterResumePostPack = api.getState();
reg.pauseAndResumeMidPack = {
  midSpinBeforePause,
  afterPauseMidReveal,
  timersAfterPauseMidReveal,
  afterResumePostPack,
};

// R3: Exit during pack reveal interval settles presentation & clears timers
byId.get("btnResetDemo").click();
byId.get("btnWatchTutorial").click();
for (let i = 0; i < 6; i++) byId.get("btnTutNext").click();
byId.get("btnTutPlayPause").click(); // Play pack-open
advanceTimers(1200); // mid-spin
byId.get("btnTutExit").click(); // Exit mid-reveal
const afterExitMidReveal = api.getState();
const timersAfterExitMidReveal = timers.size;
advanceTimers(5000);
reg.exitMidPack = {
  afterExitMidReveal,
  timersAfterExitMidReveal,
  postWaitState: api.getState(),
};

// R4a: Restart during pack reveal discards old reveal & starts fresh Stage 0 cleanly
byId.get("btnResetDemo").click();
byId.get("btnWatchTutorial").click();
for (let i = 0; i < 6; i++) byId.get("btnTutNext").click();
byId.get("btnTutPlayPause").click();
advanceTimers(1200); // mid-spin
byId.get("btnTutRestart").click();
const afterRestartMidReveal = api.getState();
advanceTimers(1500); // past old 780ms reveal window, before stage 0 (3600ms) ends
const afterRestartMidRevealLater = api.getState();
reg.restartMidPack = {
  afterRestartMidReveal,
  afterRestartMidRevealLater,
};

// R4b: Reset Session during pack reveal leaves clean reset state & stale callback never mutates it
byId.get("btnResetDemo").click();
byId.get("btnWatchTutorial").click();
for (let i = 0; i < 6; i++) byId.get("btnTutNext").click();
byId.get("btnTutPlayPause").click();
advanceTimers(1200); // mid-spin
byId.get("btnResetDemo").click();
const immediatelyAfterReset = api.getState();
advanceTimers(10000);
const afterResetWait = api.getState();
reg.resetMidPack = {
  immediatelyAfterReset,
  afterResetWait,
  timersAfterReset: timers.size,
};

// R6: Next/Previous into paused stages NEVER trigger delayed sub-actions
byId.get("btnResetDemo").click();
byId.get("btnWatchTutorial").click();
byId.get("btnTutNext").click(); // stage 1 (auth, paused)
byId.get("btnTutNext").click(); // stage 2 (home-teams, paused)
advanceTimers(10000);
const pausedHomeTeams = { state: api.getState(), timers: timers.size };
byId.get("btnTutNext").click(); // stage 3 (players-filter, paused)
advanceTimers(10000);
const pausedFilter = { state: api.getState(), timers: timers.size };
byId.get("btnTutNext").click(); // stage 4 (player-flip, paused)
advanceTimers(10000);
const pausedFlip = { state: api.getState(), timers: timers.size };
byId.get("btnTutPrev").click(); // back to stage 3 (players-filter, paused)
advanceTimers(10000);
const prevBackToFilter = { state: api.getState(), timers: timers.size };
byId.get("btnTutNext").click(); // 4
byId.get("btnTutNext").click(); // 5 (pack-market)
byId.get("btnTutNext").click(); // 6 (pack-open, paused)
advanceTimers(10000);
const pausedPackOpen = { state: api.getState(), timers: timers.size };
reg.noSubActionWhilePaused = {
  pausedHomeTeams,
  pausedFilter,
  pausedFlip,
  prevBackToFilter,
  pausedPackOpen,
};

// R7: Resume from paused filter stage & paused pack stage runs sub-action and advances
byId.get("btnTutPrev").click(); // 5
byId.get("btnTutPrev").click(); // 4
byId.get("btnTutPrev").click(); // 3 (players-filter, paused)
byId.get("btnTutPlayPause").click(); // Resume on players-filter
advanceTimers(1800); // >1700ms subDelayMs
const resumedFilterMid = api.getState();
byId.get("btnTutNext").click(); // 4 (paused)
byId.get("btnTutNext").click(); // 5 (paused)
byId.get("btnTutNext").click(); // 6 (pack-open, paused)
byId.get("btnTutPlayPause").click(); // Resume on pack-open
advanceTimers(2200); // >1100ms subDelay + 780ms reveal
const resumedPackMid = api.getState();
reg.resumeFromPausedStages = {
  resumedFilterMid,
  resumedPackMid,
};

// R8 & R9: Manual pack opening completes normally (780ms spin -> reveal) & Reset Session during manual spin prevents stale mutation
byId.get("btnResetDemo").click();
tourPills[3].click(); // manual "4. Open Pack"
byId.get("btnBuyPack").click();
const manualMidSpin = api.getState();
advanceTimers(800);
const manualRevealed = api.getState();
// Now start another manual open with extra credits, then Reset Session mid-spin
byId.get("btnAddCredits").click();
byId.get("btnBuyPack").click();
advanceTimers(200);
byId.get("btnResetDemo").click();
advanceTimers(10000);
const manualResetPostWait = api.getState();
reg.manualPackAndReset = {
  manualMidSpin,
  manualRevealed,
  manualResetPostWait,
  timersAtEnd: timers.size,
};

results.regressions = reg;

console.log(JSON.stringify(results));
"""


class FantasyBasketballTutorialTests(unittest.TestCase):
    def _run_harness(self, reduce_motion=False):
        mode = "reduce" if reduce_motion else "normal"
        proc = subprocess.run(
            ["node", "--input-type=module", "-e", NODE_HARNESS, str(DOCS), mode],
            capture_output=True,
            text=True,
        )
        self.assertEqual(proc.returncode, 0, f"Node harness failed:\nSTDOUT: {proc.stdout}\nSTDERR: {proc.stderr}")
        return json.loads(proc.stdout)

    def test_html_contains_tutorial_cta_and_preserves_eight_manual_pills(self):
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        for required_id in [
            'id="btnWatchTutorial"',
            'id="tutorialDock"',
            'id="btnTutPrev"',
            'id="btnTutPlayPause"',
            'id="btnTutNext"',
            'id="btnTutRestart"',
            'id="btnTutExit"',
            'id="tutorialProgress"',
            'id="tutorialNarration"',
        ]:
            self.assertIn(required_id, html)
        for tour_key in ["welcome", "home", "market", "pack-diamond", "my-cards", "players", "player-card", "teams"]:
            self.assertIn(f'data-tour="{tour_key}"', html)

    def test_tutorial_lifecycle_playthrough_controls_and_cleanup(self):
        data = self._run_harness(reduce_motion=False)

        # No autoplay on initial load
        self.assertFalse(data["initial"]["state"]["active"])
        self.assertFalse(data["initial"]["state"]["playing"])
        self.assertTrue(data["initial"]["dockHidden"])
        self.assertEqual(data["initial"]["activeTimers"], 0)
        self.assertEqual(data["initial"]["stageCount"], 10)
        self.assertTrue(data["initial"]["stageTourKeysValid"])

        # Starts cleanly on Watch Tutorial
        self.assertTrue(data["afterStart"]["state"]["active"])
        self.assertTrue(data["afterStart"]["state"]["playing"])
        self.assertFalse(data["afterStart"]["dockHidden"])
        self.assertTrue(data["afterStart"]["prevDisabled"])
        self.assertFalse(data["afterStart"]["nextDisabled"])
        self.assertEqual(data["afterStart"]["playPauseText"], "Pause")

        # Full 10-stage playthrough exercises real interactions
        fp = data["fullPlaythrough"]
        self.assertEqual(
            fp["seenStages"],
            ["welcome", "auth", "home-teams", "players-filter", "player-flip", "pack-market", "pack-open", "my-cards", "inspector", "finish"],
        )
        self.assertEqual(fp["snapshots"]["playersFiltered"]["position"], "Guard")
        self.assertEqual(fp["snapshots"]["playersFiltered"]["minRating"], 90)
        self.assertGreater(fp["snapshots"]["playersFiltered"]["matching"], 0)
        self.assertLess(fp["snapshots"]["playersFiltered"]["matching"], 8)
        self.assertTrue(fp["snapshots"]["cardFlipped"])
        self.assertGreaterEqual(fp["snapshots"]["packOpened"]["myCardsCount"], 1)
        self.assertTrue(fp["snapshots"]["inspectorLeague"])
        self.assertTrue(fp["endState"]["completed"])
        self.assertFalse(fp["endState"]["playing"])
        self.assertEqual(fp["activeTimersAtEnd"], 0)
        self.assertTrue(fp["nextDisabledAtEnd"])
        self.assertEqual(fp["playPauseTextAtEnd"], "Replay")

        # Restart / Next / Prev / Resume / Pause
        ctrl = data["controls"]
        self.assertEqual(ctrl["afterRestart"]["stageIndex"], 0)
        self.assertTrue(ctrl["afterRestart"]["playing"])
        self.assertEqual(ctrl["afterNext"]["stageIndex"], 1)
        self.assertEqual(ctrl["afterPrev"]["stageIndex"], 0)
        self.assertTrue(ctrl["afterResume"]["playing"])
        self.assertFalse(ctrl["afterPause"]["playing"])
        self.assertEqual(ctrl["timersWhilePaused"], 0)
        self.assertTrue(ctrl["stayedPausedAfter60s"])

        # Repeated starts do not leak timers
        self.assertLessEqual(data["repeatedStartTimers"], 2)

        # Exit cleans up all timers and hides dock
        ex = data["exit"]
        self.assertFalse(ex["afterExit"]["active"])
        self.assertEqual(ex["timersAfterExit"], 0)
        self.assertTrue(ex["dockHiddenAfterExit"])
        self.assertTrue(ex["noMutationsAfterExit"])

        # Manual tour pills remain independent & exit active tutorial cleanly
        man = data["manualIndependence"]
        self.assertFalse(man["afterManualPill"]["active"])
        self.assertEqual(man["afterManualPill"]["screen"], "market")
        self.assertEqual(man["timersAfterManualPill"], 0)
        self.assertEqual(man["afterSecondManualPill"]["screen"], "teams")
        self.assertTrue(man["teamsPillActive"])

        # Session controls preserved
        sess = data["sessionControls"]
        self.assertEqual(sess["creditsAfterAdd"], 2000)
        self.assertFalse(sess["afterReset"]["active"])
        self.assertEqual(sess["afterReset"]["credits"], 1000)
        self.assertEqual(sess["afterReset"]["myCardsCount"], 0)
        self.assertEqual(sess["timersAfterReset"], 0)

        # Escape key closes tutorial cleanly
        self.assertFalse(data["escapeExit"]["active"])
        self.assertEqual(data["escapeExit"]["timers"], 0)

    def test_reduced_motion_mode_completes_cleanly(self):
        data = self._run_harness(reduce_motion=True)
        fp = data["fullPlaythrough"]
        self.assertEqual(len(fp["seenStages"]), 10)
        self.assertTrue(fp["snapshots"]["cardFlipped"])
        self.assertGreaterEqual(fp["snapshots"]["packOpened"]["myCardsCount"], 1)
        self.assertTrue(fp["endState"]["completed"])
        self.assertEqual(fp["activeTimersAtEnd"], 0)

    def test_defect_a_and_b_lifecycle_regressions(self):
        data = self._run_harness(reduce_motion=False)
        reg = data["regressions"]

        # Defect A (R1, R2, R5): Pause during pack reveal settles state; Resume does NOT double-deduct or duplicate card
        pr = reg["pauseAndResumeMidPack"]
        self.assertTrue(pr["midSpinBeforePause"]["packSpinning"])
        self.assertFalse(pr["midSpinBeforePause"]["packOpenedDone"])
        self.assertEqual(pr["midSpinBeforePause"]["credits"], 1000)
        self.assertEqual(pr["midSpinBeforePause"]["myCardsCount"], 1)

        self.assertFalse(pr["afterPauseMidReveal"]["playing"])
        self.assertFalse(pr["afterPauseMidReveal"]["packSpinning"])
        self.assertTrue(pr["afterPauseMidReveal"]["packOpenedDone"])
        self.assertIsNotNone(pr["afterPauseMidReveal"]["lastOpenedPlayerName"])
        self.assertEqual(pr["afterPauseMidReveal"]["credits"], 1000)
        self.assertEqual(pr["afterPauseMidReveal"]["myCardsCount"], 1)
        self.assertEqual(pr["timersAfterPauseMidReveal"], 0)

        # After Resume, advances to my-cards without opening a second pack
        self.assertEqual(pr["afterResumePostPack"]["credits"], 1000)
        self.assertEqual(pr["afterResumePostPack"]["myCardsCount"], 1)
        self.assertGreaterEqual(pr["afterResumePostPack"]["stageIndex"], 7)

        # Defect A (R3): Exit during pack reveal settles presentation & cleans up timers
        ex = reg["exitMidPack"]
        self.assertFalse(ex["afterExitMidReveal"]["active"])
        self.assertFalse(ex["afterExitMidReveal"]["packSpinning"])
        self.assertTrue(ex["afterExitMidReveal"]["packOpenedDone"])
        self.assertIsNotNone(ex["afterExitMidReveal"]["lastOpenedPlayerName"])
        self.assertEqual(ex["afterExitMidReveal"]["credits"], 0)
        self.assertEqual(ex["afterExitMidReveal"]["myCardsCount"], 1)
        self.assertEqual(ex["timersAfterExitMidReveal"], 0)

        # Defect A (R4a): Restart during pack reveal discards old reveal cleanly
        rs = reg["restartMidPack"]
        self.assertEqual(rs["afterRestartMidReveal"]["stageIndex"], 0)
        self.assertEqual(rs["afterRestartMidReveal"]["screen"], "welcome")
        self.assertEqual(rs["afterRestartMidReveal"]["credits"], 1000)
        self.assertEqual(rs["afterRestartMidReveal"]["myCardsCount"], 0)
        self.assertFalse(rs["afterRestartMidRevealLater"]["packOpenedDone"])
        self.assertIsNone(rs["afterRestartMidRevealLater"]["lastOpenedPlayerName"])
        self.assertEqual(rs["afterRestartMidRevealLater"]["screen"], "welcome")

        # Defect A (R4b): Reset Session during pack reveal prevents stale mutation
        rst = reg["resetMidPack"]
        self.assertFalse(rst["immediatelyAfterReset"]["active"])
        self.assertEqual(rst["immediatelyAfterReset"]["credits"], 1000)
        self.assertEqual(rst["immediatelyAfterReset"]["myCardsCount"], 0)
        self.assertFalse(rst["afterResetWait"]["packSpinning"])
        self.assertFalse(rst["afterResetWait"]["packOpenedDone"])
        self.assertIsNone(rst["afterResetWait"]["lastOpenedPlayerName"])
        self.assertEqual(rst["afterResetWait"]["screen"], "welcome")
        self.assertEqual(rst["timersAfterReset"], 0)

        # Defect B (R6): Next / Previous into paused stages never run delayed sub-actions
        np = reg["noSubActionWhilePaused"]
        self.assertEqual(np["pausedHomeTeams"]["state"]["screen"], "home")
        self.assertEqual(np["pausedHomeTeams"]["timers"], 0)
        self.assertEqual(np["pausedFilter"]["state"]["filters"]["position"], "All")
        self.assertEqual(np["pausedFilter"]["state"]["filters"]["minRating"], 0)
        self.assertEqual(np["pausedFilter"]["timers"], 0)
        self.assertFalse(np["pausedFlip"]["state"]["isCardFlipped"])
        self.assertEqual(np["pausedFlip"]["timers"], 0)
        self.assertEqual(np["prevBackToFilter"]["state"]["filters"]["position"], "All")
        self.assertEqual(np["prevBackToFilter"]["timers"], 0)
        self.assertEqual(np["pausedPackOpen"]["state"]["credits"], 1000)
        self.assertEqual(np["pausedPackOpen"]["state"]["myCardsCount"], 0)
        self.assertFalse(np["pausedPackOpen"]["state"]["packSpinning"])
        self.assertEqual(np["pausedPackOpen"]["timers"], 0)

        # Defect B (R7): Resume from paused filter & pack stages runs sub-action cleanly
        rm = reg["resumeFromPausedStages"]
        self.assertEqual(rm["resumedFilterMid"]["filters"]["position"], "Guard")
        self.assertEqual(rm["resumedFilterMid"]["filters"]["minRating"], 90)
        self.assertTrue(rm["resumedFilterMid"]["subActionDone"])
        self.assertEqual(rm["resumedPackMid"]["myCardsCount"], 1)
        self.assertTrue(rm["resumedPackMid"]["packOpenedDone"])
        self.assertFalse(rm["resumedPackMid"]["packSpinning"])
        self.assertIsNotNone(rm["resumedPackMid"]["lastOpenedPlayerName"])

        # R8 & R9: Manual pack opening works & Reset Session during manual spin prevents stale mutation
        mp = reg["manualPackAndReset"]
        self.assertTrue(mp["manualMidSpin"]["packSpinning"])
        self.assertFalse(mp["manualMidSpin"]["packOpenedDone"])
        self.assertFalse(mp["manualRevealed"]["packSpinning"])
        self.assertTrue(mp["manualRevealed"]["packOpenedDone"])
        self.assertIsNotNone(mp["manualRevealed"]["lastOpenedPlayerName"])
        self.assertEqual(mp["manualRevealed"]["myCardsCount"], 1)

        self.assertEqual(mp["manualResetPostWait"]["screen"], "welcome")
        self.assertEqual(mp["manualResetPostWait"]["credits"], 1000)
        self.assertEqual(mp["manualResetPostWait"]["myCardsCount"], 0)
        self.assertFalse(mp["manualResetPostWait"]["packSpinning"])
        self.assertFalse(mp["manualResetPostWait"]["packOpenedDone"])
        self.assertIsNone(mp["manualResetPostWait"]["lastOpenedPlayerName"])
        self.assertEqual(mp["timersAtEnd"], 0)

    def test_viewport_visibility_and_scroll_behavior(self):
        viewport_harness = r"""
import path from "node:path";
import { pathToFileURL } from "node:url";

const docsDir = process.argv[1];
const mode = process.argv[2]; // "desktop" | "mobile" | "reduce" | "short"
const reduceMotionFlag = mode === "reduce";

let nowMs = 0;
let nextTimerId = 1;
const timers = new Map();
const scrollCalls = [];
const focusCalls = [];
const winListeners = new Map();
let deferSmoothScroll = false;

const layouts = {
  desktop: {
    innerWidth: 1440,
    innerHeight: 900,
    topbarSticky: true,
    topbarHeight: 66,
    dockDocTop: 390,
    dockHeight: 110,
    phoneDocTop: 522,
    phoneHeight: 780,
    inspectorDocTop: 522,
    inspectorHeight: 300,
  },
  mobile: {
    innerWidth: 390,
    innerHeight: 844,
    topbarSticky: false,
    topbarHeight: 196,
    dockDocTop: 792,
    dockHeight: 190,
    phoneDocTop: 996,
    phoneHeight: 700,
    inspectorDocTop: 1760,
    inspectorHeight: 460,
  },
};
const cfg = mode === "short"
  ? { ...layouts.mobile, innerWidth: 320, innerHeight: 480, dockHeight: 235, phoneDocTop: 1041 }
  : mode === "mobile" ? layouts.mobile : layouts.desktop;

globalThis.window = globalThis;
window.innerWidth = cfg.innerWidth;
window.innerHeight = cfg.innerHeight;
window.scrollY = 0;
window.scrollTo = (opts) => {
  const top = typeof opts === "number" ? opts : Number(opts?.top || 0);
  const behavior = typeof opts === "object" && opts ? opts.behavior : "auto";
  scrollCalls.push({ top, behavior, fromY: window.scrollY });
  if (deferSmoothScroll && behavior === "smooth") return;
  window.scrollY = Math.max(0, top);
  for (const fn of winListeners.get("scroll") || []) fn({});
};
window.addEventListener = (type, fn) => {
  if (!winListeners.has(type)) winListeners.set(type, []);
  winListeners.get(type).push(fn);
};
window.getComputedStyle = (el) => {
  if (el?.selector === ".topbar") return { position: cfg.topbarSticky ? "sticky" : "static" };
  return { overflowX: cfg.topbarSticky ? "clip" : "hidden" };
};
window.setTimeout = (fn, delay = 0) => {
  const id = nextTimerId++;
  timers.set(id, { id, fn, runAt: nowMs + Math.max(0, Number(delay) || 0) });
  return id;
};
window.clearTimeout = (id) => timers.delete(id);
window.requestAnimationFrame = (fn) => { fn(); return 1; };
window.matchMedia = (q) => ({
  matches: q.includes("prefers-reduced-motion") ? reduceMotionFlag : false,
  media: q,
});

function advanceTimers(ms) {
  const target = nowMs + ms;
  while (true) {
    let earliest = null;
    for (const t of timers.values()) {
      if (t.runAt <= target && (!earliest || t.runAt < earliest.runAt || (t.runAt === earliest.runAt && t.id < earliest.id))) {
        earliest = t;
      }
    }
    if (!earliest) break;
    timers.delete(earliest.id);
    nowMs = earliest.runAt;
    earliest.fn();
  }
  nowMs = target;
}

class FakeEl {
  constructor(tag, id = "", attrs = {}, rectFn = null) {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.selector = attrs.selector || "";
    this.attrs = { ...attrs };
    this.dataset = {};
    this.hidden = Boolean(attrs.hidden);
    this.disabled = false;
    this.textContent = "";
    this.innerHTML = "";
    this.style = {};
    this.listeners = new Map();
    this._rectFn = rectFn;
    this._classes = new Set((attrs.class || "").split(/\s+/).filter(Boolean));
    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("data-")) {
        this.dataset[k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
      }
    }
    this.classList = {
      add: (c) => this._classes.add(c),
      remove: (c) => this._classes.delete(c),
      toggle: (c, f) => (f ? this._classes.add(c) : this._classes.delete(c)),
      contains: (c) => this._classes.has(c),
    };
  }
  getBoundingClientRect() {
    if (this._rectFn) return this._rectFn();
    return { top: 0, bottom: 0, height: 0, left: 0, right: 0, width: 0 };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }
  click() {
    if (this.disabled) return;
    for (const fn of this.listeners.get("click") || []) fn({ target: this, preventDefault() {} });
  }
  focus(opts) {
    document.activeElement = this;
    focusCalls.push({ id: this.id, preventScroll: Boolean(opts?.preventScroll) });
  }
  contains() { return false; }
  querySelectorAll() { return []; }
}

const byId = new Map();
const mk = (tag, id, attrs = {}, rectFn = null) => {
  const el = new FakeEl(tag, id, attrs, rectFn);
  if (id) byId.set(id, el);
  return el;
};

const topbar = new FakeEl("header", "", { selector: ".topbar" }, () => {
  const top = cfg.topbarSticky ? 0 : -window.scrollY;
  return { top, bottom: top + cfg.topbarHeight, height: cfg.topbarHeight };
});
const phoneBezel = new FakeEl("div", "", { selector: ".phone-bezel" }, () => {
  const top = cfg.phoneDocTop - window.scrollY;
  return { top, bottom: top + cfg.phoneHeight, height: cfg.phoneHeight };
});
const inspectorShell = new FakeEl("section", "", { selector: ".inspector-shell" }, () => {
  const top = cfg.inspectorDocTop - window.scrollY;
  return { top, bottom: top + cfg.inspectorHeight, height: cfg.inspectorHeight };
});
const tutorialControls = new FakeEl("div", "", { selector: ".tutorial-controls" }, () => {
  const top = cfg.dockDocTop + 76 - window.scrollY;
  return { top, bottom: top + 55, height: 55 };
});

mk("section", "tutorialDock", { hidden: true }, () => {
  const top = cfg.dockDocTop - window.scrollY;
  return { top, bottom: top + cfg.dockHeight, height: cfg.dockHeight };
});

for (const [tag, id, attrs] of [
  ["div", "phoneBody", {}],
  ["div", "iosStatusbar", {}],
  ["div", "homeIndicator", {}],
  ["div", "panelTrace", {}],
  ["div", "panelLeague", { hidden: true }],
  ["div", "panelArch", { hidden: true }],
  ["div", "srAnnouncer", {}],
  ["button", "btnAddCredits", {}],
  ["button", "btnResetDemo", {}],
  ["button", "btnWatchTutorial", {}],
  ["span", "tutorialStepBadge", {}],
  ["span", "tutorialStateBadge", {}],
  ["h2", "tutorialStageTitle", {}],
  ["div", "tutorialProgress", {}],
  ["div", "tutorialProgressFill", {}],
  ["p", "tutorialNarration", {}],
  ["button", "btnTutPrev", {}],
  ["button", "btnTutPlayPause", {}],
  ["button", "btnTutNext", {}],
  ["button", "btnTutRestart", {}],
  ["button", "btnTutExit", {}],
  ["button", "btnBuyPack", {}],
]) {
  mk(tag, id, attrs);
}

const tourPills = ["welcome", "home", "market", "pack-diamond", "my-cards", "players", "player-card", "teams"].map(
  (k) => new FakeEl("button", "", { class: "tour-pill", "data-tour": k })
);
const inspectorTabs = ["trace", "league", "arch"].map(
  (k) => new FakeEl("button", `tab_${k}`, { class: "inspector-tab", "data-inspector": k })
);

globalThis.document = {
  activeElement: null,
  documentElement: { clientHeight: cfg.innerHeight },
  body: {},
  getElementById: (id) => byId.get(id) || null,
  querySelector: (sel) => {
    if (sel === ".topbar") return topbar;
    if (sel === ".phone-bezel") return phoneBezel;
    if (sel === ".inspector-shell") return inspectorShell;
    if (sel === ".tutorial-controls") return tutorialControls;
    return null;
  },
  querySelectorAll: (sel) => {
    if (sel === ".tour-pill") return tourPills;
    if (sel === ".inspector-tab") return inspectorTabs;
    return [];
  },
  addEventListener: () => {},
};

await import(pathToFileURL(path.join(docsDir, "app.js")).href);
const api = window.__FB_TUTORIAL__;

// 1. Start Watch Tutorial from scrollY=0
byId.get("btnWatchTutorial").click();
const afterStartY = window.scrollY;
const startScrollCalls = scrollCalls.length;
const startBehavior = scrollCalls[0]?.behavior || null;
const startFocus = focusCalls[focusCalls.length - 1];
const dockTopAfterStart = byId.get("tutorialDock").getBoundingClientRect().top;
const phoneRectAfterStart = phoneBezel.getBoundingClientRect();
const controlsRectAfterStart = tutorialControls.getBoundingClientRect();

if (mode === "short") {
  console.log(JSON.stringify({ controlsRectAfterStart, phoneRectAfterStart }));
  process.exit(0);
}

// 2. Advance 2 auto stages (must NOT emit redundant scroll jumps while already visible)
advanceTimers(8000);
const scrollCallsAfterTwoStages = scrollCalls.length;

// 3. Simulate deliberate user scroll away to top (scrollY = 0), then advance automatically
window.scrollY = 0;
for (const fn of winListeners.get("scroll") || []) fn({});
const userScrolledFlag = api.getState().userScrolledAway;
const callsBeforeAutoAfterUserScroll = scrollCalls.length;
advanceTimers(5000);
const yAfterAutoWithUserScroll = window.scrollY;
const callsAfterAutoWithUserScroll = scrollCalls.length;

// 4. Pause & Resume must NOT unexpectedly jump scrollY
byId.get("btnTutPlayPause").click(); // Pause
const yAfterPause = window.scrollY;
byId.get("btnTutPlayPause").click(); // Resume
const yAfterResume = window.scrollY;

// 5. Restart resets userScrolledAway and repositions consistently with Watch Tutorial start
byId.get("btnTutRestart").click();
const yAfterRestart = window.scrollY;
const userScrolledAfterRestart = api.getState().userScrolledAway;

// 6. Step to Stage 9 (inspector) via Next and verify Inspector visibility
for (let i = 0; i < 8; i++) byId.get("btnTutNext").click();
const stageAtInspector = api.getState().stageId;
const yAtInspector = window.scrollY;
const inspectorTopAtStage9 = inspectorShell.getBoundingClientRect().top;

// 7. Step Next to Stage 10 (finish) -> returns to dock+phone if stacked
byId.get("btnTutNext").click();
const yAtFinish = window.scrollY;

// 8. Exit leaves scrollY untouched and focuses btnWatchTutorial with preventScroll
const yBeforeExit = window.scrollY;
byId.get("btnTutExit").click();
const yAfterExit = window.scrollY;
const exitFocus = focusCalls[focusCalls.length - 1];

// Exit while the browser is still animating the first scroll.
window.scrollY = 0;
deferSmoothScroll = true;
byId.get("btnWatchTutorial").click();
window.scrollY = 100;
byId.get("btnTutExit").click();
const interruptedScroll = scrollCalls.at(-1);

console.log(JSON.stringify({
  afterStartY,
  startScrollCalls,
  startBehavior,
  startFocus,
  dockTopAfterStart,
  phoneRectAfterStart,
  scrollCallsAfterTwoStages,
  userScrolledFlag,
  callsBeforeAutoAfterUserScroll,
  callsAfterAutoWithUserScroll,
  yAfterAutoWithUserScroll,
  yAfterPause,
  yAfterResume,
  yAfterRestart,
  userScrolledAfterRestart,
  stageAtInspector,
  yAtInspector,
  inspectorTopAtStage9,
  yAtFinish,
  yBeforeExit,
  yAfterExit,
  exitFocus,
  interruptedScroll,
}));
"""
        for mode in ("desktop", "mobile", "reduce", "short"):
            proc = subprocess.run(
                ["node", "--input-type=module", "-e", viewport_harness, str(DOCS), mode],
                capture_output=True,
                text=True,
            )
            self.assertEqual(proc.returncode, 0, f"Viewport harness ({mode}) failed:\n{proc.stderr}")
            res = json.loads(proc.stdout)

            if mode == "short":
                self.assertGreaterEqual(res["controlsRectAfterStart"]["top"], 0)
                self.assertLessEqual(res["controlsRectAfterStart"]["bottom"], 480)
                self.assertGreaterEqual(480 - res["phoneRectAfterStart"]["top"], 280)
                continue

            # Start Watch Tutorial repositions viewport & passes preventScroll focus
            self.assertGreater(res["afterStartY"], 250, f"Expected initial guided scroll in {mode}")
            self.assertEqual(res["startScrollCalls"], 1)
            self.assertEqual(res["startBehavior"], "auto" if mode == "reduce" else "smooth")
            self.assertEqual(res["startFocus"], {"id": "btnTutPlayPause", "preventScroll": True})

            # Sticky topbar clearance respected on desktop; dock + phone positioned cleanly
            if mode in ("desktop", "reduce"):
                self.assertGreaterEqual(res["dockTopAfterStart"], 74)
                self.assertLess(res["phoneRectAfterStart"]["top"], 250)
            else:
                self.assertGreaterEqual(res["dockTopAfterStart"], 8)
                self.assertLess(res["phoneRectAfterStart"]["top"], 230)

            # No repeated scroll jumps across stages while showcase is already visible
            self.assertEqual(res["scrollCallsAfterTwoStages"], 1)

            # Deliberate manual scroll is respected (auto-advance does NOT hijack scrollY back)
            self.assertTrue(res["userScrolledFlag"])
            self.assertEqual(res["callsAfterAutoWithUserScroll"], res["callsBeforeAutoAfterUserScroll"])
            self.assertEqual(res["yAfterAutoWithUserScroll"], 0)

            # Pause and Resume do not unexpectedly jump scrollY
            self.assertEqual(res["yAfterPause"], 0)
            self.assertEqual(res["yAfterResume"], 0)

            # Restart matches initial Watch Tutorial start consistently
            self.assertEqual(res["yAfterRestart"], res["afterStartY"])
            self.assertFalse(res["userScrolledAfterRestart"])

            # Inspector stage visibility (desktop stays put with zero jump; mobile scrolls to inspector & returns at finish)
            self.assertEqual(res["stageAtInspector"], "inspector")
            if mode == "mobile":
                self.assertGreater(res["yAtInspector"], res["yAfterRestart"] + 500)
                self.assertLessEqual(res["inspectorTopAtStage9"], 40)
                self.assertEqual(res["yAtFinish"], res["afterStartY"])
            else:
                self.assertEqual(res["yAtInspector"], res["yAfterRestart"])

            # Exit leaves scrollY free and restores focus with preventScroll
            self.assertEqual(res["yAfterExit"], res["yBeforeExit"])
            self.assertEqual(res["exitFocus"], {"id": "btnWatchTutorial", "preventScroll": True})
            if mode != "reduce":
                self.assertEqual(res["interruptedScroll"], {"top": 100, "behavior": "instant", "fromY": 100})


if __name__ == "__main__":
    unittest.main(verbosity=2)
