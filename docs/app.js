import {
  BACKEND_LEAGUE_STEPS,
  CARD_PACKS,
  NATIONALITIES,
  PLAYERS,
  POSITIONS,
  STARTING_CREDITS,
  TEAMS,
} from "./data.js";

const DEMO_TOKEN = "demo_token_9f8e7d6c5b4a3210";

// Exact PlayerDetailView.swift gradients, titles, borders, and shine rules
const SWIFT_CARD_STYLES = {
  DarkBlueDiamond: {
    title: "Dark Blue Diamond 💠",
    bg: "linear-gradient(135deg, rgba(0, 122, 255, 0.92) 0%, #000000 100%)",
    rim: "rgba(147, 197, 253, 0.85)",
    glow: "rgba(0, 122, 255, 0.65)",
    shine: true,
    ovrColor: "#93c5fd",
  },
  PinkDiamond: {
    title: "Pink Diamond 💎",
    bg: "linear-gradient(135deg, #ff2d55 0%, #af52de 100%)",
    rim: "rgba(255, 214, 232, 0.85)",
    glow: "rgba(255, 45, 85, 0.6)",
    shine: true,
    ovrColor: "#fde68a",
  },
  Diamond: {
    title: "Diamond 🔷",
    bg: "linear-gradient(135deg, rgba(0, 122, 255, 0.78) 0%, #32ade6 100%)",
    rim: "rgba(207, 250, 254, 0.88)",
    glow: "rgba(50, 173, 230, 0.6)",
    shine: true,
    ovrColor: "#fef08a",
  },
  Amethyst: {
    title: "Amethyst 🟪",
    bg: "linear-gradient(135deg, #af52de 0%, #007aff 100%)",
    rim: "rgba(216, 180, 254, 0.8)",
    glow: "rgba(175, 82, 222, 0.55)",
    shine: false,
    ovrColor: "#e0f2fe",
  },
  Ruby: {
    title: "Ruby 🛑",
    bg: "linear-gradient(135deg, rgba(255, 59, 48, 0.92) 0%, #000000 100%)",
    rim: "rgba(253, 186, 116, 0.75)",
    glow: "rgba(255, 59, 48, 0.6)",
    shine: false,
    ovrColor: "#fde68a",
  },
  Gold: {
    title: "Gold ⭐️",
    bg: "linear-gradient(135deg, #ffcc00 0%, #ff9500 100%)",
    rim: "rgba(255, 251, 235, 0.85)",
    glow: "rgba(255, 149, 0, 0.6)",
    shine: false,
    ovrColor: "#1d4ed8",
  },
};

function swiftRatingColor(ovr) {
  if (ovr >= 95) return { fg: "#1a3399", bg: "rgba(26, 51, 153, 0.22)" };
  if (ovr >= 90) return { fg: "#d916d9", bg: "rgba(217, 22, 217, 0.18)" };
  if (ovr >= 85) return { fg: "#007aff", bg: "rgba(0, 122, 255, 0.18)" };
  if (ovr >= 80) return { fg: "#9333ea", bg: "rgba(147, 51, 234, 0.18)" };
  if (ovr >= 75) return { fg: "#dc2626", bg: "rgba(220, 38, 38, 0.18)" };
  return { fg: "#b45309", bg: "rgba(250, 204, 21, 0.28)" };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatSkill(skill) {
  return skill.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateIos(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// Original SVG basketball emblem matching homelogo1.2.png visual identity
function homeLogoImg(size = 156) {
  return `<img src="assets/basketball-logo.svg" width="${size}" height="${size}" alt="Fantasy Basketball logo" style="width:${size}px;height:${size}px;object-fit:contain;filter:drop-shadow(0 8px 18px rgba(0,0,0,0.38))" />`;
}

// SF-Symbol-matching inline SVGs for MarketplaceView & CardPackDetailView (sparkles, hexagon, diamond)
function packIconSvg(packId, size = 50) {
  if (packId === "gold") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.1 5.9L20 10l-5.9 2.1L12 18l-2.1-5.9L4 10l5.9-2.1L12 2zm7 12l1 2.7L22.7 18 20 19l-1 2.7L18 19l-2.7-1L18 16.7 19 14zM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15z"/></svg>`;
  }
  if (packId === "amethyst") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2.5L20.2 7.25v9.5L12 21.5l-8.2-4.75v-9.5L12 2.5z" fill="currentColor" fill-opacity="0.18"/></svg>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2.5L21 12l-9 9.5L3 12 12 2.5z" fill="currentColor" fill-opacity="0.18"/></svg>`;
}

function playerImgTag(player, altText) {
  return `<img src="${escapeHtml(player.profile_picture)}" alt="${escapeHtml(altText)}" style="object-position:center center" />`;
}

function weightedRarityDraw(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [rarity, weight] of entries) {
    r -= weight;
    if (r <= 0) return rarity;
  }
  return "Gold";
}

function createInitialState() {
  return {
    isLoggedIn: false,
    username: "hoopfan",
    email: "hoopfan@gmail.com",
    token: null,
    credits: STARTING_CREDITS,
    myCards: [],
    screen: "welcome",
    prevScreen: "home",
    selectedTeamId: TEAMS[0].id,
    selectedPlayerId: PLAYERS[0].id, // Stephen Curry (id: 1)
    isCardFlipped: false,
    selectedPackId: CARD_PACKS[0].id,
    lastOpenedPlayer: null,
    packUpdatedCredits: null,
    packError: null,
    packSpinning: false,
    packOpenedDone: false,
    authError: null,
    filters: {
      position: "All",
      country: "All",
      team: "All",
      minRating: 0,
    },
    inspectorTab: "trace",
    selectedLeagueStepId: BACKEND_LEAGUE_STEPS[0].id,
    traces: [],
    selectedTraceIdx: 0,
  };
}

let state = createInitialState();
let sessionVersion = 0;
let pendingPackReveal = null;

function cancelPendingPackReveal() {
  if (pendingPackReveal !== null) {
    window.clearTimeout(pendingPackReveal.timer);
    pendingPackReveal = null;
  }
}

function settlePendingPackReveal({ renderNow = true } = {}) {
  if (pendingPackReveal === null) return false;
  const pending = pendingPackReveal;
  window.clearTimeout(pending.timer);
  pendingPackReveal = null;
  if (pending.sessionVersion !== sessionVersion) return false;
  pending.complete({ renderNow });
  return true;
}

const phoneBody = document.getElementById("phoneBody");
const iosStatusbar = document.getElementById("iosStatusbar");
const homeIndicator = document.getElementById("homeIndicator");
const panelTrace = document.getElementById("panelTrace");
const panelLeague = document.getElementById("panelLeague");
const panelArch = document.getElementById("panelArch");
const srAnnouncer = document.getElementById("srAnnouncer");

function announce(msg) {
  srAnnouncer.textContent = "";
  window.requestAnimationFrame(() => {
    srAnnouncer.textContent = msg;
  });
}

function recordTrace({ method, endpoint, status, swiftView, djangoView, permission, request, response, note }) {
  const entry = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    method,
    endpoint,
    status,
    swiftView,
    djangoView,
    permission,
    headers: state.token ? { Authorization: `Token ${state.token}` } : {},
    request,
    response,
    note,
  };
  state.traces.unshift(entry);
  if (state.traces.length > 14) state.traces.pop();
  state.selectedTraceIdx = 0;
}

function requireDemoLoginIfNeeded(targetScreen) {
  if (!state.isLoggedIn && !["welcome", "login", "register"].includes(targetScreen)) {
    state.isLoggedIn = true;
    state.token = DEMO_TOKEN;
    recordTrace({
      method: "POST",
      endpoint: "/api/token-login/",
      status: 200,
      swiftView: "AuthService.swift",
      djangoView: "obtain_auth_token",
      permission: "AllowAny",
      request: { username: state.username, password: "••••••••" },
      response: { token: DEMO_TOKEN },
      note: "Auto-authenticated browser demo session for guided walkthrough.",
    });
  }
}

function serializePlayer(p) {
  return {
    id: p.id,
    name: p.name,
    team: p.team,
    team_name: p.team_name,
    position: p.position,
    age: p.age,
    height: p.height,
    weight: p.weight,
    profile_picture: `/media/player_pictures/${p.profile_picture.split("/").pop()}`,
    bio: p.bio,
    experience_years: p.experience_years,
    nationality: p.nationality,
    overall_rating: p.overall_rating,
    best_skill: p.best_skill,
    rarity: p.rarity,
  };
}

function getFilteredPlayers() {
  return PLAYERS.filter((p) => {
    if (state.filters.position !== "All" && p.position !== state.filters.position) return false;
    if (state.filters.country !== "All" && p.nationality !== state.filters.country) return false;
    if (state.filters.team !== "All" && p.team_name !== state.filters.team) return false;
    if (p.overall_rating < Number(state.filters.minRating)) return false;
    return true;
  }).sort((a, b) => b.overall_rating - a.overall_rating);
}

function navigate(screen, opts = {}) {
  if (pendingPackReveal !== null) {
    settlePendingPackReveal({ renderNow: false });
  }
  requireDemoLoginIfNeeded(screen);
  if (opts.teamId !== undefined) state.selectedTeamId = opts.teamId;
  if (opts.playerId !== undefined) {
    state.selectedPlayerId = opts.playerId;
    state.isCardFlipped = false;
  }
  if (opts.packId !== undefined) {
    state.selectedPackId = opts.packId;
    state.lastOpenedPlayer = null;
    state.packUpdatedCredits = null;
    state.packError = null;
    state.packSpinning = false;
    state.packOpenedDone = false;
  }
  if (opts.from) state.prevScreen = opts.from;
  state.authError = null;
  state.screen = screen;

  if (screen === "home") {
    recordTrace({
      method: "GET",
      endpoint: "/api/profile/",
      status: 200,
      swiftView: "HomeView.swift",
      djangoView: "UserProfileView",
      permission: "IsAuthenticated",
      request: null,
      response: { username: state.username, credits: state.credits },
      note: "HomeView displays Welcome pill, original basketball SVG emblem, and 5 stacked gradient buttons.",
    });
  } else if (screen === "teams") {
    recordTrace({
      method: "GET",
      endpoint: "/api/teams/",
      status: 200,
      swiftView: "TeamsView.swift → APIService.fetchTeams()",
      djangoView: "TeamViewSet (list)",
      permission: "IsAdminOrReadOnly (Phase 2A)",
      request: null,
      response: TEAMS.map(({ id, name, city, established_year, arena_name, logo }) => ({
        id,
        name,
        city,
        established_year,
        logo: `/media/team_logos/${logo.split("/").pop()}`,
        arena_name,
      })),
      note: "Displays the 4 clubs with original geometric monogram badges over the systemGray2 → orange gradient.",
    });
  } else if (screen === "team-players") {
    const roster = PLAYERS.filter((p) => p.team === state.selectedTeamId);
    recordTrace({
      method: "GET",
      endpoint: `/api/players/?team=${state.selectedTeamId}`,
      status: 200,
      swiftView: "TeamPlayersView.swift → APIService.fetchPlayers(forTeamId:)",
      djangoView: "PlayerViewSet (DjangoFilterBackend)",
      permission: "IsAdminOrReadOnly (Phase 2A)",
      request: null,
      response: roster.map(serializePlayer),
      note: "Server-side team filter backed by django_filters (`filterset_fields = ['team']`).",
    });
  } else if (screen === "players") {
    const filtered = getFilteredPlayers();
    recordTrace({
      method: "GET",
      endpoint: "/api/players/",
      status: 200,
      swiftView: "PlayersView.swift → APIService.fetchPlayers()",
      djangoView: "PlayerViewSet (list)",
      permission: "IsAdminOrReadOnly (Phase 2A)",
      request: null,
      response: {
        count_total: PLAYERS.length,
        matching_client_filters: filtered.length,
        active_filters: { ...state.filters },
        sample: filtered.slice(0, 2).map(serializePlayer),
      },
      note: "Shows all 8 real players with verified Creative Commons portraits and Position, Country, Team, and 0–99 OVR filters.",
    });
  } else if (screen === "player-detail") {
    const p = PLAYERS.find((x) => x.id === state.selectedPlayerId) || PLAYERS[0];
    const provenanceNote =
      p.provenance === "verbatim_swift_preview"
        ? `Verbatim attributes from PlayerDetailView.swift:297-314. ${p.photoCredit}.`
        : `Illustrative demo card ratings (not official league stats) aligned to PlayerSerializer. ${p.photoCredit}.`;
    recordTrace({
      method: "GET",
      endpoint: `/api/players/${p.id}/`,
      status: 200,
      swiftView: "PlayerDetailView.swift (3D Flippable Collectible Card)",
      djangoView: "PlayerViewSet (retrieve)",
      permission: "IsAdminOrReadOnly (Phase 2A)",
      request: null,
      response: serializePlayer(p),
      note: `${provenanceNote} Tap card to flip 180° for Best Skill and physical stats.`,
    });
  } else if (screen === "market") {
    recordTrace({
      method: "GET",
      endpoint: "/api/profile/",
      status: 200,
      swiftView: "MarketplaceView.swift (PackMarket)",
      djangoView: "UserProfileView",
      permission: "IsAuthenticated",
      request: null,
      response: { username: state.username, credits: state.credits },
      note: "2-column .ultraThinMaterial PackMarket grid reproducing samplePacks (Gold 500, Amethyst 800, Diamond 1,000).",
    });
  } else if (screen === "pack-detail") {
    const pk = CARD_PACKS.find((x) => x.id === state.selectedPackId) || CARD_PACKS[0];
    recordTrace({
      method: "GET",
      endpoint: "/api/profile/",
      status: 200,
      swiftView: "CardPackDetailView.swift",
      djangoView: "OpenCardPackView (Verified Drop Table)",
      permission: "IsAuthenticated",
      request: null,
      response: {
        pack_name: pk.name,
        pack_cost: pk.price,
        current_credits: state.credits,
        verified_rarity_weights_pct: pk.weights,
      },
      note: "Tap Buy & Open for the 360° spinning icon animation and atomic POST /api/open-pack/ simulation.",
    });
  } else if (screen === "my-cards") {
    recordTrace({
      method: "GET",
      endpoint: "/api/my-cards/",
      status: 200,
      swiftView: "MyCardsView.swift → APIService.fetchMyCards()",
      djangoView: "MyCardsView",
      permission: "IsAuthenticated",
      request: null,
      response: state.myCards.map((c) => ({
        player_name: c.player.name,
        overall_rating: c.player.overall_rating,
        rarity: c.player.rarity,
        acquired_at: c.acquired_at,
      })),
      note: "Displays owned UserCard rows formatted with UserCardSerializer.",
    });
  }

  render();
}

function handleOpenPack() {
  const pack = CARD_PACKS.find((pk) => pk.id === state.selectedPackId) || CARD_PACKS[0];
  state.packError = null;

  if (state.credits < pack.price) {
    state.packError = `Not enough credits. Need ${pack.price} coins; current balance is ${state.credits}.`;
    recordTrace({
      method: "POST",
      endpoint: "/api/open-pack/",
      status: 400,
      swiftView: "CardPackDetailView.swift → APIService.openCardPack()",
      djangoView: "OpenCardPackView",
      permission: "IsAuthenticated",
      request: { pack_name: pack.name },
      response: { error: "Not enough credits." },
      note: "Conditional atomic credit check rejects insufficient balance with zero mutation.",
    });
    announce(state.packError);
    render();
    return;
  }

  const rolledRarity = weightedRarityDraw(pack.weights);
  let pool = PLAYERS.filter((p) => p.rarity === rolledRarity);
  if (!pool.length) pool = PLAYERS.filter((p) => p.rarity === "Gold");
  const pulled = pool[Math.floor(Math.random() * pool.length)];

  state.credits -= pack.price;
  state.packUpdatedCredits = state.credits;
  state.myCards.unshift({
    id: Date.now() + Math.random(),
    player: pulled,
    acquired_at: new Date().toISOString(),
  });
  state.packSpinning = true;
  state.lastOpenedPlayer = null;
  state.packOpenedDone = false;

  recordTrace({
    method: "POST",
    endpoint: "/api/open-pack/",
    status: 200,
    swiftView: "CardPackDetailView.swift → APIService.openCardPack()",
    djangoView: "OpenCardPackView (transaction.atomic)",
    permission: "IsAuthenticated",
    request: { pack_name: pack.name },
    response: {
      message: "Card opened!",
      player: serializePlayer(pulled),
      new_credits: state.credits,
    },
    note: `Rolled '${rolledRarity}' using verified ${pack.name} weights. Credits deducted and UserCard created atomically.`,
  });

  render();

  const openSessionVersion = sessionVersion;
  const completeReveal = ({ renderNow = true } = {}) => {
    if (openSessionVersion !== sessionVersion) return;
    state.packSpinning = false;
    state.lastOpenedPlayer = pulled;
    state.packOpenedDone = true;
    announce(`Opened ${pack.name}: pulled ${pulled.name}, ${pulled.overall_rating} overall, ${pulled.rarity}. Updated coins: ${state.credits}.`);
    if (renderNow) render();
  };

  cancelPendingPackReveal();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    completeReveal({ renderNow: true });
  } else {
    const timer = window.setTimeout(() => {
      pendingPackReveal = null;
      completeReveal({ renderNow: true });
    }, 780);
    pendingPackReveal = { timer, sessionVersion: openSessionVersion, complete: completeReveal };
  }
}

/* ==================== FAITHFUL SWIFTUI SCREEN RENDERERS ==================== */

function renderWelcome() {
  return `
    <div class="sw-flame-screen">
      <div style="display:flex;flex-direction:column;align-items:center;gap:24px;margin-top:24px">
        ${homeLogoImg(160)}
        <h2 class="sw-brand-title">Fantasy Basketball</h2>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-bottom:16px">
        <button id="btnGoLogin" class="sw-btn sw-btn-yellow-orange" type="button">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 14a4 4 0 1 1 3.46-2H21v3h-2v2h-3v-2h-2v2h-3.54A4 4 0 0 1 7 14zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>
          <span>Login</span>
        </button>
        <button id="btnGoRegister" class="sw-btn sw-btn-yellow-orange" type="button">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-9 2v-2H4v2H2v2h2v2h2v-2h2v-2H6zm9 1c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span>Register</span>
        </button>
        <button id="btnQuickDemoLogin" class="sw-demo-shortcut" type="button">
          Quick Demo Sign-In (hoopfan) →
        </button>
      </div>
    </div>
  `;
}

function renderLogin() {
  return `
    <div class="sw-court-screen">
      <h2 class="sw-auth-title">Login</h2>

      <form id="loginForm" style="width:100%;display:flex;flex-direction:column;align-items:center;gap:8px">
        ${state.authError ? `<div class="sw-alert error" role="alert">${escapeHtml(state.authError)}</div>` : ""}
        <div class="sw-field-group">
          <label class="sw-field-label" for="loginUsername">Username</label>
          <input id="loginUsername" class="sw-textfield" type="text" value="${escapeHtml(state.username)}" required />
        </div>
        <div class="sw-field-group">
          <label class="sw-field-label" for="loginPassword">Password</label>
          <input id="loginPassword" class="sw-textfield" type="password" value="Password123" required />
        </div>
        <button class="sw-btn sw-btn-purple-blue" type="submit" style="margin-top:6px">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 14a4 4 0 1 1 3.46-2H21v3h-2v2h-3v-2h-2v2h-3.54A4 4 0 0 1 7 14z"/></svg>
          <span>Login</span>
        </button>
      </form>

      <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
        <button class="sw-btn sw-btn-yellow-orange" type="button" data-nav="register">
          <span>Sign Up</span>
        </button>
        <button class="sw-btn sw-btn-black-gray" type="button" data-nav="welcome">
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div class="sw-court-screen">
      <h2 class="sw-auth-title">Registration</h2>

      <form id="registerForm" style="width:100%;display:flex;flex-direction:column;align-items:center;gap:4px">
        ${state.authError ? `<div class="sw-alert error" role="alert">${escapeHtml(state.authError)}</div>` : ""}
        <div class="sw-field-group">
          <label class="sw-field-label" for="regUsername">Username</label>
          <input id="regUsername" class="sw-textfield" type="text" value="newcoach" required />
        </div>
        <div class="sw-field-group">
          <label class="sw-field-label" for="regEmail">Email</label>
          <input id="regEmail" class="sw-textfield" type="email" value="newcoach@gmail.com" required />
        </div>
        <div class="sw-field-group">
          <label class="sw-field-label" for="regPassword">Password</label>
          <input id="regPassword" class="sw-textfield" type="password" value="CourtPass9" required />
        </div>
        <button class="sw-btn sw-btn-yellow-orange" type="submit" style="margin-top:4px">
          <span>Register</span>
        </button>
      </form>

      <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
        <button class="sw-btn sw-btn-purple-blue" type="button" data-nav="login">
          <span>Have an account?</span>
        </button>
        <button class="sw-btn sw-btn-black-gray" type="button" data-nav="welcome">
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  `;
}

function renderHome() {
  return `
    <div class="sw-flame-screen" style="padding-top:46px;padding-bottom:26px">
      <div class="sw-welcome-row">
        <span class="sw-welcome-pill">Welcome, ${escapeHtml(state.username)}</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:6px 0">
        ${homeLogoImg(118)}
        <h2 class="sw-brand-title" style="font-size:1.95rem">Fantasy Basketball</h2>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:11px;margin-top:6px">
        <button class="sw-btn sw-btn-orange-red" type="button" data-nav="teams">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="12" y1="5" x2="12" y2="19"/><circle cx="12" cy="12" r="3"/></svg>
          <span>View Teams</span>
        </button>
        <button class="sw-btn sw-btn-orange-red" type="button" data-nav="players">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span>View Players</span>
        </button>
        <button class="sw-btn sw-btn-pink-orange" type="button" data-nav="market">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.03-.12.9-1.64h7.45c.75 0 1.41-.41 1.75-1.03L21 4.96 19.25 4l-3.7 6.5H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.26-.24z"/></svg>
          <span>Marketplace</span>
        </button>
        <button class="sw-btn sw-btn-purple-indigo" type="button" data-nav="my-cards">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6h16v12H4z" opacity=".9"/><path d="M6 3h12v2H6zM6 19h12v2H6z"/></svg>
          <span>My Cards (${state.myCards.length})</span>
        </button>
        <button id="btnLogout" class="sw-btn sw-btn-red-black" type="button" style="margin-top:6px">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14-4-4 4-4v3h4v2h-4z"/></svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  `;
}

function renderTeams() {
  return `
    <div class="sw-gray-orange-screen">
      <div class="sw-ios-navrow">
        <button class="sw-ios-back" type="button" data-nav="home">‹ Home</button>
        <span style="font-size:0.74rem;font-weight:700;color:#374151">${TEAMS.length} Teams</span>
      </div>
      <h2 class="sw-large-title">Teams</h2>
      <div class="sw-teams-grid">
        ${TEAMS.map(
          (t) => `
          <button class="sw-team-tile" type="button" data-team="${t.id}">
            <img class="sw-team-logo" src="${escapeHtml(t.logo)}" alt="${escapeHtml(t.name)} logo" />
            <div class="sw-tile-name">${escapeHtml(t.name)}</div>
            <div class="sw-tile-city">${escapeHtml(t.city)}</div>
            <div class="sw-tile-since">Since ${t.established_year}</div>
          </button>
        `
        ).join("")}
      </div>
    </div>
  `;
}

function renderTeamPlayers() {
  const team = TEAMS.find((t) => t.id === state.selectedTeamId) || TEAMS[0];
  const roster = PLAYERS.filter((p) => p.team === team.id).sort((a, b) => b.overall_rating - a.overall_rating);
  return `
    <div class="sw-gray-orange-screen">
      <div class="sw-ios-navrow">
        <button class="sw-ios-back" type="button" data-nav="teams">‹ Teams</button>
        <span style="font-size:0.74rem;font-weight:700;color:#374151">${escapeHtml(team.name)}</span>
      </div>
      <h2 class="sw-large-title">Team Players</h2>
      <div class="sw-players-grid" style="grid-template-columns:repeat(2,1fr);gap:8px">
        ${roster.map((p) => renderSwiftPlayerTile(p, "team-players", false)).join("")}
      </div>
    </div>
  `;
}

function renderSwiftPlayerTile(p, fromScreen, showTeam = true) {
  const rc = swiftRatingColor(p.overall_rating);
  return `
    <button class="sw-player-tile" type="button" data-player="${p.id}" data-from="${fromScreen}">
      <div class="sw-player-avatar-sm">${playerImgTag(p, p.name)}</div>
      <div class="sw-player-tile-name">${escapeHtml(p.name)}</div>
      ${showTeam ? `<div class="sw-player-tile-team">${escapeHtml(p.team_name)}</div>` : ""}
      <span class="sw-ovr-badge" style="color:${rc.fg};background:${rc.bg}">OVR: ${p.overall_rating}</span>
    </button>
  `;
}

function renderPlayers() {
  const filtered = getFilteredPlayers();
  const teamNames = ["All", ...TEAMS.map((t) => t.name)];
  return `
    <div class="sw-gray-orange-screen">
      <div class="sw-ios-navrow">
        <button class="sw-ios-back" type="button" data-nav="home">‹ Home</button>
        <span style="font-size:0.74rem;font-weight:700;color:#374151">${filtered.length} / ${PLAYERS.length}</span>
      </div>
      <h2 class="sw-large-title">Players</h2>

      <div class="sw-filter-bar" aria-label="Player filters">
        <label class="sw-filter-item">
          <span class="sw-filter-icon" aria-hidden="true">Pos</span>
          <select id="fPosition" aria-label="Filter by Position">
            ${POSITIONS.map((pos) => `<option value="${pos}" ${state.filters.position === pos ? "selected" : ""}>${pos}</option>`).join("")}
          </select>
        </label>
        <label class="sw-filter-item">
          <span class="sw-filter-icon" aria-hidden="true">Nat</span>
          <select id="fCountry" aria-label="Filter by Country">
            ${NATIONALITIES.map((c) => `<option value="${c}" ${state.filters.country === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </label>
        <label class="sw-filter-item full">
          <span class="sw-filter-icon" aria-hidden="true">Team</span>
          <select id="fTeam" aria-label="Filter by Team">
            ${teamNames.map((tn) => `<option value="${escapeHtml(tn)}" ${state.filters.team === tn ? "selected" : ""}>${escapeHtml(tn)}</option>`).join("")}
          </select>
        </label>
        <label class="sw-filter-item full">
          <span class="sw-filter-icon" aria-hidden="true">★</span>
          <span class="sw-filter-val">${state.filters.minRating}</span>
          <input id="fMinOvr" type="range" min="0" max="99" value="${state.filters.minRating}" aria-label="Minimum Overall Rating" />
        </label>
      </div>

      ${
        filtered.length
          ? `<div class="sw-players-grid">${filtered.map((p) => renderSwiftPlayerTile(p, "players", true)).join("")}</div>`
          : `<div style="text-align:center;padding:24px 12px;background:rgba(255,255,255,0.5);border-radius:12px;color:#111827;font-size:0.84rem">
               No players match these filters.<br/>
               <button id="btnClearFilters" class="sw-btn sw-btn-solid-orange" type="button" style="width:160px;height:38px;font-size:0.84rem;margin-top:10px">Reset Filters</button>
             </div>`
      }
    </div>
  `;
}

function renderPlayerDetail() {
  const p = PLAYERS.find((x) => x.id === state.selectedPlayerId) || PLAYERS[0];
  const st = SWIFT_CARD_STYLES[p.rarity];
  return `
    <div class="sw-detail-screen" style="--card-bg-gradient:${st.bg};--card-rim:${st.rim};--card-glow:${st.glow}">
      <div class="sw-detail-inner">
        <div class="sw-detail-nav">
          <button class="sw-ios-back" type="button" data-nav="${escapeHtml(state.prevScreen)}">‹ Back</button>
          <span class="sw-detail-nav-title">${escapeHtml(p.name)}</span>
          <span style="width:46px"></span>
        </div>

        <button id="btnFlipCard" class="sw-flip-scene" type="button" aria-pressed="${state.isCardFlipped}" aria-label="Player collectible card for ${escapeHtml(p.name)}. Activate to flip between front summary and back details.">
          <div class="sw-flip-card ${state.isCardFlipped ? "is-flipped" : ""}">
            <!-- frontCardView (PlayerDetailView.swift:133-212) -->
            <div class="sw-card-face front">
              ${st.shine ? `<div class="sw-card-shine" aria-hidden="true"></div>` : ""}
              <div class="sw-rarity-pill">${escapeHtml(st.title)}</div>
              <div class="sw-portrait-ring">${playerImgTag(p, `${p.name} portrait`)}</div>
              <h3 class="sw-card-name">${escapeHtml(p.name)}</h3>
              <p class="sw-card-team">${escapeHtml(p.team_name)}</p>
              <p class="sw-card-pos">Position: ${escapeHtml(p.position)}</p>
              <p class="sw-card-ovr" style="color:${st.ovrColor}">Overall: ${p.overall_rating}</p>
            </div>

            <!-- backCardView (PlayerDetailView.swift:214-238) -->
            <div class="sw-card-face back">
              ${st.shine ? `<div class="sw-card-shine" aria-hidden="true"></div>` : ""}
              <div class="sw-rarity-pill" style="margin-bottom:18px">${escapeHtml(st.title)}</div>
              <div class="sw-card-back-title">Best Skill</div>
              <div class="sw-card-back-skill">${escapeHtml(formatSkill(p.best_skill))}</div>
              <div class="sw-card-back-list">
                <div><strong>Experience:</strong> ${p.experience_years} years</div>
                <div><strong>Nationality:</strong> ${escapeHtml(p.nationality)}</div>
                <div><strong>Age:</strong> ${p.age}</div>
                <div><strong>Height:</strong> ${p.height}</div>
                <div><strong>Weight:</strong> ${p.weight}</div>
              </div>
            </div>
          </div>
        </button>

        <div class="sw-flip-hint">
          ${state.isCardFlipped ? "Showing back · Tap card to flip to front" : "Tap card to flip for Best Skill & stats"}
        </div>
      </div>
    </div>
  `;
}

function renderMarket() {
  return `
    <div class="sw-light-screen">
      <div class="sw-market-header">
        <h2 class="sw-market-title">PackMarket</h2>
        <span class="sw-coin-badge-ios">💳 ${state.credits.toLocaleString()}</span>
      </div>

      <div class="sw-pack-grid">
        ${CARD_PACKS.map(
          (pack) => `
          <button class="sw-pack-tile" type="button" data-open-pack-view="${pack.id}">
            <div style="color:#ff9500">${packIconSvg(pack.id, 48)}</div>
            <div class="sw-pack-tile-name">${escapeHtml(pack.name)}</div>
            <div class="sw-pack-tile-desc">${escapeHtml(pack.swiftDescription)}</div>
            <div class="sw-pack-tile-price">💰 ${pack.price.toLocaleString()} Coins</div>
          </button>
        `
        ).join("")}
      </div>

      <button class="sw-back-full-orange" type="button" data-nav="home">
        <span>↩ Back to Main Page</span>
      </button>
    </div>
  `;
}

function renderPackDetail() {
  const pack = CARD_PACKS.find((pk) => pk.id === state.selectedPackId) || CARD_PACKS[0];
  const pulled = state.lastOpenedPlayer;
  return `
    <div class="sw-pack-detail-screen">
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:6px">
        <div class="sw-pack-spinner ${state.packSpinning ? "spinning" : ""}">
          ${packIconSvg(pack.id, 84)}
        </div>
        <h2 class="sw-market-title" style="font-size:1.6rem">${escapeHtml(pack.name)}</h2>
        <div style="font-size:0.84rem;color:#4b5563">${escapeHtml(pack.swiftDescription)}</div>
        <div style="font-size:1.12rem;font-weight:700;color:#ea580c">💰 ${pack.price.toLocaleString()} Coins</div>
        <div style="font-size:0.78rem;color:#374151">Balance: <strong>${state.credits.toLocaleString()}</strong> Coins</div>
        ${
          state.packUpdatedCredits !== null
            ? `<div style="font-size:0.84rem;font-weight:700;color:#15803d">🔄 Updated Coins: ${state.packUpdatedCredits.toLocaleString()}</div>`
            : ""
        }
        ${
          state.packError
            ? `<div style="font-size:0.8rem;font-weight:700;color:#dc2626" role="alert">❌ ${escapeHtml(state.packError)}</div>`
            : ""
        }
      </div>

      ${
        pulled
          ? `
        <div class="sw-reveal-card">
          <div style="font-size:0.9rem;font-weight:700;margin-bottom:6px">🎉 You Got:</div>
          <div class="sw-player-avatar-sm" style="width:68px;height:68px;margin:0 auto 8px;border:2px solid #fff">${playerImgTag(pulled, pulled.name)}</div>
          <div style="font-size:1.18rem;font-weight:800;margin-bottom:2px">${escapeHtml(pulled.name)}</div>
          <div style="font-size:0.78rem;color:#4b5563;margin-bottom:10px">Rarity: ${escapeHtml(pulled.rarity)} · ${pulled.overall_rating} OVR</div>
          <button class="sw-btn sw-btn-purple-indigo" type="button" data-player="${pulled.id}" data-from="pack-detail" style="width:184px;height:36px;font-size:0.82rem">
            Inspect 3D Card →
          </button>
        </div>
      `
          : ""
      }

      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:auto">
        <button id="btnBuyPack" class="sw-btn sw-btn-orange-red" type="button" ${state.packSpinning && !state.packOpenedDone ? "disabled" : ""}>
          <span>${state.packOpenedDone ? "Open Another Pack" : state.packSpinning ? "Opening..." : "Buy & Open"}</span>
        </button>
        <button class="sw-btn sw-btn-solid-orange" type="button" data-nav="market">
          <span>↩ Back</span>
        </button>
      </div>
    </div>
  `;
}

function renderMyCards() {
  return `
    <div class="sw-light-screen">
      <div class="sw-ios-navrow">
        <button class="sw-ios-back" type="button" data-nav="home">‹ Home</button>
        <span style="font-size:0.74rem;font-weight:700;color:#4b5563">${state.myCards.length} Owned</span>
      </div>
      <h2 class="sw-brand-title" style="font-size:2rem;margin:4px 0 14px">My Cards</h2>

      ${
        state.myCards.length
          ? `<div class="sw-mycards-list">
              ${state.myCards
                .map((entry) => {
                  const p = entry.player;
                  return `
                    <button class="sw-mycards-row" type="button" data-player="${p.id}" data-from="my-cards">
                      <div style="display:flex;align-items:center;gap:10px">
                        <div class="sw-player-avatar-sm">${playerImgTag(p, p.name)}</div>
                        <div>
                          <div style="font-size:0.96rem;font-weight:700;color:#111827">${escapeHtml(p.name)}</div>
                          <div style="font-size:0.84rem;font-weight:700;color:#ea580c">${p.overall_rating} OVR · ${escapeHtml(p.rarity)}</div>
                          <div style="font-size:0.72rem;color:#6b7280">Acquired: ${formatDateIos(entry.acquired_at)}</div>
                        </div>
                      </div>
                      <span style="color:#9ca3af;font-size:1.1rem" aria-hidden="true">›</span>
                    </button>
                  `;
                })
                .join("")}
            </div>`
          : `<div style="text-align:center;color:#6b7280;margin:40px 0 auto;font-size:0.95rem">
               You have no cards.
               <div style="margin-top:16px">
                 <button class="sw-btn sw-btn-pink-orange" type="button" data-nav="market" style="width:200px;height:44px;font-size:0.92rem">Go to Marketplace</button>
               </div>
             </div>`
      }
    </div>
  `;
}

/* ==================== ENGINEERING INSPECTOR PANELS ==================== */

function renderTracePanel() {
  if (!state.traces.length) {
    return `
      <p style="font-size:0.84rem;color:var(--text-muted);margin-top:0">
        Interact with any screen inside the SwiftUI phone frame (or choose a Guided Tour step above) to inspect the matching Django REST Framework endpoint, authorization rule, and serializer JSON payload.
      </p>
      <div class="meta-tile">
        <div class="meta-k">Media Licensing &amp; Data Provenance</div>
        <div style="font-size:0.82rem;color:var(--text-muted)">
          Portraits and the court backdrop use verified Creative Commons photographs from Wikimedia Commons (<a href="notices.html">full credits &amp; licenses</a>); the app icon and 4 club emblems are original SVGs. Stephen Curry's attributes match <code>PlayerDetailView.swift</code> verbatim, while ratings for the other 7 players are illustrative demo values. Zero live backend requests are made.
        </div>
      </div>
    `;
  }

  const active = state.traces[state.selectedTraceIdx] || state.traces[0];
  const isOk = active.status >= 200 && active.status < 300;
  return `
    <div class="inspector-meta-grid">
      <div class="meta-tile">
        <div class="meta-k">Endpoint &amp; Status</div>
        <div class="meta-v">
          <span class="method-badge method-${active.method}">${active.method}</span>${escapeHtml(active.endpoint)}
          <div class="${isOk ? "status-ok" : "status-err"}" style="font-size:0.76rem;margin-top:3px">HTTP ${active.status}</div>
        </div>
      </div>
      <div class="meta-tile">
        <div class="meta-k">Django View &amp; Permission</div>
        <div class="meta-v">${escapeHtml(active.djangoView)}</div>
        <div style="font-size:0.73rem;color:var(--text-muted);margin-top:2px">${escapeHtml(active.permission)}</div>
      </div>
      <div class="meta-tile">
        <div class="meta-k">SwiftUI Source</div>
        <div class="meta-v">${escapeHtml(active.swiftView)}</div>
      </div>
    </div>

    <p style="font-size:0.82rem;color:var(--text-muted);margin:0 0 10px">${escapeHtml(active.note)}</p>

    <div class="code-section-label">Request Headers &amp; Payload (Simulated)</div>
    <pre class="code-block">${escapeHtml(JSON.stringify({ headers: active.headers, body: active.request }, null, 2))}</pre>

    <div class="code-section-label">Serializer Response JSON</div>
    <pre class="code-block">${escapeHtml(JSON.stringify(active.response, null, 2))}</pre>

    <div class="code-section-label">Recent Session Trace (${state.traces.length})</div>
    <div class="history-list">
      ${state.traces
        .map(
          (tr, i) => `
        <button class="history-item ${i === state.selectedTraceIdx ? "active" : ""}" type="button" data-trace-idx="${i}">
          <span><span class="method-badge method-${tr.method}">${tr.method}</span>${escapeHtml(tr.endpoint)}</span>
          <span class="${tr.status < 300 ? "status-ok" : "status-err"}">${tr.status} · ${formatTime(tr.timestamp)}</span>
        </button>
      `
        )
        .join("")}
    </div>
  `;
}

function renderLeaguePanel() {
  const step = BACKEND_LEAGUE_STEPS.find((s) => s.id === state.selectedLeagueStepId) || BACKEND_LEAGUE_STEPS[0];
  return `
    <div class="backend-only-banner" role="note">
      <strong>Backend-Only API Surface (Not Wired in SwiftUI):</strong> The Django backend implements relational models (<code>League</code>, <code>UserLeague</code>, <code>UserLeaguePlayer</code>, <code>Match</code>, <code>PlayerStats</code>, <code>TeamStats</code>) and REST endpoints verified by Phase 2A regression tests. They are inspected here transparently rather than fabricated as iOS screens.
    </div>

    <div class="step-pills" role="group" aria-label="Backend league workflow steps">
      ${BACKEND_LEAGUE_STEPS.map(
        (s) => `<button class="step-pill ${s.id === step.id ? "active" : ""}" type="button" data-league-step="${s.id}">${escapeHtml(s.title)}</button>`
      ).join("")}
    </div>

    <div class="inspector-meta-grid">
      <div class="meta-tile">
        <div class="meta-k">Endpoint</div>
        <div class="meta-v"><span class="method-badge method-${step.method}">${step.method}</span>${escapeHtml(step.endpoint)}</div>
      </div>
      <div class="meta-tile">
        <div class="meta-k">Django View</div>
        <div class="meta-v">${escapeHtml(step.djangoView)}</div>
      </div>
      <div class="meta-tile">
        <div class="meta-k">Authorization Boundary</div>
        <div class="meta-v">${escapeHtml(step.permission)}</div>
      </div>
    </div>

    <p style="font-size:0.83rem;color:var(--text-muted);margin:0 0 10px">${escapeHtml(step.summary)}</p>

    ${
      step.request !== null
        ? `<div class="code-section-label">Sample Request Body</div><pre class="code-block">${escapeHtml(JSON.stringify(step.request, null, 2))}</pre>`
        : ""
    }
    <div class="code-section-label">Sample Response (HTTP ${step.status})</div>
    <pre class="code-block">${escapeHtml(JSON.stringify(step.response, null, 2))}</pre>
  `;
}

function renderArchPanel() {
  return `
    <div class="arch-grid">
      <div class="arch-card">
        <h3>Public Asset Rights &amp; Data Provenance</h3>
        <ul>
          <li><strong>Verified CC photography:</strong> All 8 real-player portraits and the sunset court background are cropped/resized derivatives of Wikimedia Commons CC BY / CC BY-SA photos (documented in <a href="notices.html">Third-Party Notices</a>).</li>
          <li><strong>Original vector graphics:</strong> <code>basketball-logo.svg</code> and the 4 geometric club badges (<code>GSW</code>, <code>LAL</code>, <code>PHX</code>, <code>FB</code>) are original SVGs avoiding trademarked club marks.</li>
          <li><strong>Verbatim vs. demo data:</strong> Stephen Curry (97 OVR, Dark Blue Diamond) matches <code>PlayerDetailView.swift:297-314</code> verbatim; the other 7 players carry illustrative demo ratings (not official league stats) because <code>db.sqlite3</code> was untracked in commit <code>9d0362f</code>.</li>
        </ul>
      </div>
      <div class="arch-card">
        <h3>Django 5.2 DRF Backend (Remediated)</h3>
        <ul>
          <li>Environment-only <code>DJANGO_SECRET_KEY</code> (fail-closed when <code>DEBUG=False</code>), explicit CORS allowlist, pinned security updates.</li>
          <li><code>IsAdminOrReadOnly</code> on Team/Player catalogs; staff-only schedule creation &amp; match result recording.</li>
          <li>Atomic <code>OpenCardPackView</code> credit deduction + card creation; verified by 13 Django API regression tests.</li>
        </ul>
      </div>
      <div class="arch-card">
        <h3>Honest Scope &amp; Limitations</h3>
        <ul>
          <li><strong>Source-faithful scope:</strong> Demonstrates only verified SwiftUI and Django REST capabilities; unimplemented features are excluded.</li>
          <li><strong>SQLite concurrency note:</strong> SQLite lacks row-level <code>SELECT ... FOR UPDATE</code>; conditional atomic updates protect balances under SQLite's DB write lock, while PostgreSQL is recommended for multi-worker concurrency.</li>
          <li><strong>Browser simulation:</strong> Runs entirely statically with zero live API or database dependency.</li>
        </ul>
      </div>
    </div>
  `;
}

/* ==================== MASTER RENDER & EVENTS ==================== */

function render() {
  const lightScreens = ["teams", "team-players", "players", "player-detail", "market", "pack-detail", "my-cards"];
  const isLight = lightScreens.includes(state.screen);
  iosStatusbar.classList.toggle("light-text-dark", isLight);
  homeIndicator.classList.toggle("dark", isLight);

  switch (state.screen) {
    case "welcome": phoneBody.innerHTML = renderWelcome(); break;
    case "login": phoneBody.innerHTML = renderLogin(); break;
    case "register": phoneBody.innerHTML = renderRegister(); break;
    case "home": phoneBody.innerHTML = renderHome(); break;
    case "teams": phoneBody.innerHTML = renderTeams(); break;
    case "team-players": phoneBody.innerHTML = renderTeamPlayers(); break;
    case "players": phoneBody.innerHTML = renderPlayers(); break;
    case "player-detail": phoneBody.innerHTML = renderPlayerDetail(); break;
    case "market": phoneBody.innerHTML = renderMarket(); break;
    case "pack-detail": phoneBody.innerHTML = renderPackDetail(); break;
    case "my-cards": phoneBody.innerHTML = renderMyCards(); break;
  }

  panelTrace.innerHTML = renderTracePanel();
  panelLeague.innerHTML = renderLeaguePanel();
  panelArch.innerHTML = renderArchPanel();

  panelTrace.hidden = state.inspectorTab !== "trace";
  panelLeague.hidden = state.inspectorTab !== "league";
  panelArch.hidden = state.inspectorTab !== "arch";
  document.querySelectorAll(".inspector-tab").forEach((t) => {
    t.setAttribute("aria-selected", String(t.dataset.inspector === state.inspectorTab));
  });

  document.querySelectorAll(".tour-pill").forEach((pill) => {
    const key = pill.dataset.tour;
    const isMatch =
      (key === "welcome" && ["welcome", "login", "register"].includes(state.screen)) ||
      (key === "pack-diamond" && state.screen === "pack-detail") ||
      (key === "player-card" && state.screen === "player-detail") ||
      (key === "teams" && ["teams", "team-players"].includes(state.screen)) ||
      key === state.screen;
    pill.classList.toggle("active", isMatch);
  });

  bindDynamicEvents();
}

function bindDynamicEvents() {
  document.getElementById("btnQuickDemoLogin")?.addEventListener("click", () => {
    state.isLoggedIn = true;
    state.token = DEMO_TOKEN;
    recordTrace({
      method: "POST",
      endpoint: "/api/login/",
      status: 200,
      swiftView: "LoginView.swift → AuthService.loginWithToken()",
      djangoView: "LoginView",
      permission: "AllowAny",
      request: { username: state.username, password: "••••••••" },
      response: { message: `✅ Welcome, ${state.username}!`, username: state.username, email: state.email, token: DEMO_TOKEN },
      note: "Issued DRF auth token for browser demo session.",
    });
    navigate("home");
  });

  document.getElementById("btnGoLogin")?.addEventListener("click", () => navigate("login"));
  document.getElementById("btnGoRegister")?.addEventListener("click", () => navigate("register"));

  document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("loginUsername").value.trim();
    const pw = document.getElementById("loginPassword").value;
    if (!u || pw.length < 4) {
      state.authError = "All fields are required.";
      recordTrace({
        method: "POST",
        endpoint: "/api/login/",
        status: 400,
        swiftView: "LoginView.swift",
        djangoView: "LoginView",
        permission: "AllowAny",
        request: { username: u, password: "•••" },
        response: { error: "❌ All fields are required." },
        note: "Validation failure mirrors LoginView.",
      });
      render();
      return;
    }
    state.username = u;
    state.isLoggedIn = true;
    state.token = DEMO_TOKEN;
    recordTrace({
      method: "POST",
      endpoint: "/api/login/",
      status: 200,
      swiftView: "LoginView.swift",
      djangoView: "LoginView",
      permission: "AllowAny",
      request: { username: u, password: "••••••••" },
      response: { message: `✅ Welcome, ${u}!`, username: u, email: `${u}@gmail.com`, token: DEMO_TOKEN },
      note: "Simulated login succeeded and stored demo token.",
    });
    navigate("home");
  });

  document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pw = document.getElementById("regPassword").value;
    const domain = email.split("@")[1] || "";
    const allowed = ["gmail.com", "yahoo.com", "outlook.com"];
    let err = null;
    if (u.length < 3) err = "Username must be at least 3 characters long.";
    else if (!allowed.includes(domain)) err = "Email domain must be gmail.com, yahoo.com, or outlook.com.";
    else if (pw.length < 8 || !/\d/.test(pw) || !/[a-zA-Z]/.test(pw)) err = "Password must be 8+ characters with a letter and a number.";

    if (err) {
      state.authError = err;
      recordTrace({
        method: "POST",
        endpoint: "/api/register/",
        status: 400,
        swiftView: "RegisterView.swift",
        djangoView: "RegisterView (RegisterSerializer)",
        permission: "AllowAny",
        request: { username: u, email, password: "••••••••" },
        response: { error: err },
        note: "Exact RegisterSerializer validation error triggered.",
      });
      render();
      return;
    }

    state.username = u;
    state.email = email;
    state.isLoggedIn = true;
    state.token = DEMO_TOKEN;
    state.credits = STARTING_CREDITS;
    recordTrace({
      method: "POST",
      endpoint: "/api/register/",
      status: 201,
      swiftView: "RegisterView.swift",
      djangoView: "RegisterView (transaction.atomic)",
      permission: "AllowAny",
      request: { username: u, email, password: "••••••••" },
      response: { message: "✅ User registered successfully!" },
      note: "Creates User and UserProfile(credits=1000) atomically.",
    });
    navigate("home");
  });

  document.getElementById("btnLogout")?.addEventListener("click", () => {
    state.isLoggedIn = false;
    state.token = null;
    state.screen = "welcome";
    announce("Logged out of demo session.");
    render();
  });

  document.getElementById("btnFlipCard")?.addEventListener("click", () => {
    state.isCardFlipped = !state.isCardFlipped;
    const p = PLAYERS.find((x) => x.id === state.selectedPlayerId) || PLAYERS[0];
    announce(state.isCardFlipped ? `Flipped ${p.name} card to back showing Best Skill and stats.` : `Flipped ${p.name} card to front.`);
    render();
    document.getElementById("btnFlipCard")?.focus();
  });

  phoneBody.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });

  phoneBody.querySelectorAll("[data-team]").forEach((el) => {
    el.addEventListener("click", () => navigate("team-players", { teamId: Number(el.dataset.team) }));
  });

  phoneBody.querySelectorAll("[data-player]").forEach((el) => {
    el.addEventListener("click", () =>
      navigate("player-detail", { playerId: Number(el.dataset.player), from: el.dataset.from || state.screen })
    );
  });

  phoneBody.querySelectorAll("[data-open-pack-view]").forEach((el) => {
    el.addEventListener("click", () => navigate("pack-detail", { packId: el.dataset.openPackView }));
  });

  document.getElementById("btnBuyPack")?.addEventListener("click", handleOpenPack);

  const onFilterChange = (e) => {
    const activeId = e?.target?.id || null;
    state.filters.position = document.getElementById("fPosition").value;
    state.filters.country = document.getElementById("fCountry").value;
    state.filters.team = document.getElementById("fTeam").value;
    state.filters.minRating = Number(document.getElementById("fMinOvr").value);
    const filtered = getFilteredPlayers();
    recordTrace({
      method: "GET",
      endpoint: "/api/players/",
      status: 200,
      swiftView: "PlayersView.swift (filteredPlayers)",
      djangoView: "Client-side SwiftUI filter over /api/players/",
      permission: "IsAdminOrReadOnly",
      request: null,
      response: { matching: filtered.length, filters: { ...state.filters } },
      note: "Updated SwiftUI filter bar without extra network round-trips.",
    });
    render();
    if (activeId) document.getElementById(activeId)?.focus();
  };

  ["fPosition", "fCountry", "fTeam", "fMinOvr"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", onFilterChange);
  });

  document.getElementById("btnClearFilters")?.addEventListener("click", () => {
    state.filters = { position: "All", country: "All", team: "All", minRating: 0 };
    render();
  });

  panelTrace.querySelectorAll("[data-trace-idx]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedTraceIdx = Number(el.dataset.traceIdx);
      render();
    });
  });

  panelLeague.querySelectorAll("[data-league-step]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedLeagueStepId = el.dataset.leagueStep;
      render();
    });
  });
}

// ==================== OPTIONAL GUIDED TUTORIAL CONTROLLER ====================
// Drives the actual existing SwiftUI screens, filters, 3D card flip, pack opening,
// and Engineering Inspector without replacing or degrading the 8-pill manual tour.
// Policy: clicking any manual .tour-pill or Reset Session exits tutorial mode cleanly;
// interacting directly with the phone or inspector tabs pauses auto-advance cleanly.

const TUTORIAL_STAGES = [
  {
    id: "welcome",
    title: "Welcome & Project Identity",
    tourKey: "welcome",
    durationMs: 3600,
    narration: "Fantasy Basketball pairs a native SwiftUI iOS client with a Django REST Framework backend. Watch each real demo screen and synchronized API trace step by step.",
    enter() {
      state.isLoggedIn = false;
      state.token = null;
      state.inspectorTab = "trace";
      state.screen = "welcome";
      render();
    },
  },
  {
    id: "auth",
    title: "Simulated Token Authentication",
    tourKey: "welcome",
    durationMs: 3600,
    narration: "LoginView authenticates against Django's token endpoint and stores a session token in the client — simulated safely in the browser with zero live credentials.",
    enter() {
      state.isLoggedIn = false;
      state.token = null;
      state.inspectorTab = "trace";
      navigate("login");
    },
  },
  {
    id: "home-teams",
    title: "Home Navigation & Club Rosters",
    tourKey: "teams",
    durationMs: 4400,
    subDelayMs: 1800,
    narration: "After demo login, HomeView opens the pure NavigationStack hub and drills into TeamsView showing all four clubs with original geometric monogram badges.",
    enter() {
      state.inspectorTab = "trace";
      navigate("home");
    },
    subAction() {
      navigate("teams");
    },
  },
  {
    id: "players-filter",
    title: "Player Directory & Live Filters",
    tourKey: "players",
    durationMs: 4400,
    subDelayMs: 1700,
    narration: "PlayersView renders all 8 players with four instant client-side filters. Applying Position = Guard and Min OVR = 90 narrows the grid immediately.",
    enter() {
      state.inspectorTab = "trace";
      state.filters = { position: "All", country: "All", team: "All", minRating: 0 };
      navigate("players");
    },
    subAction() {
      state.filters = { position: "Guard", country: "All", team: "All", minRating: 90 };
      const filtered = getFilteredPlayers();
      recordTrace({
        method: "GET",
        endpoint: "/api/players/",
        status: 200,
        swiftView: "PlayersView.swift (filteredPlayers)",
        djangoView: "Client-side SwiftUI filter over /api/players/",
        permission: "IsAdminOrReadOnly",
        request: null,
        response: { matching: filtered.length, filters: { ...state.filters } },
        note: "Tutorial applied Position = Guard and Min OVR = 90 filter.",
      });
      render();
    },
  },
  {
    id: "player-flip",
    title: "3D Flippable Collectible Card",
    tourKey: "player-card",
    durationMs: 4400,
    subDelayMs: 1700,
    narration: "PlayerDetailView displays rarity-styled cards with diagonal shine for high tiers and flips 180° on tap to reveal Best Skill and physical attributes.",
    enter() {
      state.inspectorTab = "trace";
      navigate("player-detail", { playerId: PLAYERS[0].id, from: "players" });
    },
    subAction() {
      state.isCardFlipped = true;
      render();
    },
  },
  {
    id: "pack-market",
    title: "PackMarket Tiers & Credits",
    tourKey: "market",
    durationMs: 3600,
    narration: "PackMarket lists Gold (500), Amethyst (800), and Diamond (1,000) packs alongside the player's current coin balance.",
    enter() {
      state.inspectorTab = "trace";
      if (state.credits < 1000) state.credits = STARTING_CREDITS;
      navigate("market");
    },
  },
  {
    id: "pack-open",
    title: "Atomic Pack Opening Simulation",
    tourKey: "pack-diamond",
    durationMs: 4600,
    subDelayMs: 1100,
    narration: "Opening the Diamond Pack runs the 360° spinner, deducts credits atomically via POST /api/open-pack/, records the trace, and reveals the pulled card.",
    enter() {
      state.inspectorTab = "trace";
      if (state.credits < 1000) state.credits = STARTING_CREDITS;
      navigate("pack-detail", { packId: "diamond" });
    },
    subAction() {
      if (!state.packOpenedDone && !state.packSpinning) {
        handleOpenPack();
      }
    },
  },
  {
    id: "my-cards",
    title: "My Cards Collection",
    tourKey: "my-cards",
    durationMs: 3600,
    narration: "MyCardsView loads owned UserCard entries from /api/my-cards/, immediately showing the newly opened card in the personal collection.",
    enter() {
      state.inspectorTab = "trace";
      if (state.myCards.length === 0) {
        state.myCards.unshift({
          id: Date.now() + Math.random(),
          player: PLAYERS[0],
          acquired_at: new Date().toISOString(),
        });
      }
      navigate("my-cards");
    },
  },
  {
    id: "inspector",
    title: "Engineering Inspector & Backend League Engine",
    tourKey: "my-cards",
    durationMs: 4400,
    subDelayMs: 1900,
    narration: "The right-hand inspector records live Django REST serializer traces and documents backend-only league endpoints (not wired into the SwiftUI screens).",
    enter() {
      state.inspectorTab = "trace";
      render();
    },
    subAction() {
      state.inspectorTab = "league";
      render();
    },
  },
  {
    id: "finish",
    title: "Tutorial Complete — Explore Manually",
    tourKey: "home",
    durationMs: 0,
    narration: "Guided walkthrough complete. Replay the tutorial anytime, or exit to explore every SwiftUI screen, filter, pack tier, and API trace manually.",
    enter() {
      state.inspectorTab = "trace";
      state.filters = { position: "All", country: "All", team: "All", minRating: 0 };
      navigate("home");
    },
  },
];

const MIN_TUTORIAL_PHONE_SCALE = 0.68;

const tutorial = {
  active: false,
  playing: false,
  completed: false,
  stageIndex: 0,
  subActionDone: false,
  runId: 0,
  stageTimer: null,
  subTimer: null,
  userScrolledAway: false,
  lastGuidedScrollY: null,
  scrollStartY: null,
  programmaticScrollUntil: 0,
  resizeIgnoreScrollUntil: 0,
  lastViewportW: null,
  lastViewportH: null,
  resizeRafId: null,
  resizeSettleTimer: null,
  phoneScale: 1,
};

const topbarEl = document.querySelector?.(".topbar") || null;
const phoneStageEl = document.querySelector?.(".phone-stage") || null;
const phoneBezelEl = document.querySelector?.(".phone-bezel") || null;
const inspectorShellEl = document.querySelector?.(".inspector-shell") || null;
const tutorialControlsEl = document.querySelector?.(".tutorial-controls") || null;

const btnWatchTutorial = document.getElementById("btnWatchTutorial");
const tutorialDock = document.getElementById("tutorialDock");
const tutorialStepBadge = document.getElementById("tutorialStepBadge");
const tutorialStateBadge = document.getElementById("tutorialStateBadge");
const tutorialStageTitle = document.getElementById("tutorialStageTitle");
const tutorialProgress = document.getElementById("tutorialProgress");
const tutorialProgressFill = document.getElementById("tutorialProgressFill");
const tutorialNarration = document.getElementById("tutorialNarration");
const btnTutPrev = document.getElementById("btnTutPrev");
const btnTutPlayPause = document.getElementById("btnTutPlayPause");
const btnTutNext = document.getElementById("btnTutNext");
const btnTutRestart = document.getElementById("btnTutRestart");
const btnTutExit = document.getElementById("btnTutExit");

function getCurrentScrollY() {
  return Number(window.scrollY ?? window.pageYOffset ?? 0);
}

function getViewportWidth() {
  return Number(window.innerWidth || document.documentElement?.clientWidth || 0);
}

function getViewportHeight() {
  return Number(window.innerHeight || document.documentElement?.clientHeight || 0);
}

function cancelPendingResizeFrame() {
  if (tutorial.resizeRafId !== null && typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(tutorial.resizeRafId);
  }
  tutorial.resizeRafId = null;
  if (tutorial.resizeSettleTimer !== null) {
    window.clearTimeout(tutorial.resizeSettleTimer);
    tutorial.resizeSettleTimer = null;
  }
}

function getStickyHeaderClearance() {
  const defaultPad = (window.innerWidth || 1200) <= 640 ? 10 : 12;
  if (!topbarEl || typeof topbarEl.getBoundingClientRect !== "function") {
    return defaultPad;
  }
  const rect = topbarEl.getBoundingClientRect();
  if (getCurrentScrollY() > 4) {
    return rect.top >= -2 && rect.bottom > 0 ? Math.ceil(rect.bottom) + 10 : defaultPad;
  }
  if (typeof window.getComputedStyle === "function") {
    const pos = window.getComputedStyle(topbarEl).position;
    if (pos === "fixed") return Math.ceil(rect.height) + 10;
    if (pos === "sticky") {
      const htmlOverflowX = document.documentElement ? window.getComputedStyle(document.documentElement).overflowX : "";
      const bodyOverflowX = document.body ? window.getComputedStyle(document.body).overflowX : "";
      if (htmlOverflowX !== "hidden" && bodyOverflowX !== "hidden") {
        return Math.ceil(rect.height) + 10;
      }
    }
  }
  return defaultPad;
}

function resetTutorialPhoneScale() {
  tutorial.phoneScale = 1;
  if (phoneStageEl?.style) {
    if (typeof phoneStageEl.style.removeProperty === "function") {
      phoneStageEl.style.removeProperty("--phone-scale");
      phoneStageEl.style.removeProperty("--phone-fit-h");
    } else {
      delete phoneStageEl.style["--phone-scale"];
      delete phoneStageEl.style["--phone-fit-h"];
    }
  }
  if (phoneStageEl?.dataset) {
    delete phoneStageEl.dataset.tutorialScaled;
  }
}

function updateTutorialPhoneScale() {
  if (!tutorial.active) {
    resetTutorialPhoneScale();
    return 1;
  }
  if (!phoneStageEl || !phoneBezelEl || !tutorialDock) return 1;

  const vh = getViewportHeight();
  if (vh <= 0) return 1;

  const vw = Number(window.innerWidth || document.documentElement?.clientWidth || 1200);
  const safeTop = getStickyHeaderClearance();
  const dockHeight = typeof tutorialDock.getBoundingClientRect === "function"
    ? tutorialDock.getBoundingClientRect().height
    : 0;
  let dockGap = vw <= 640 ? 14 : 22;
  if (typeof window.getComputedStyle === "function") {
    const parsedMargin = Number.parseFloat(window.getComputedStyle(tutorialDock).marginBottom);
    if (Number.isFinite(parsedMargin) && parsedMargin >= 0) {
      dockGap = parsedMargin;
    }
  }
  const bottomReserve = vw <= 640 ? 12 : 16;

  // Use untransformed layout height (offsetHeight) so repeated calls never compound scaling.
  const baseH = Number(phoneBezelEl.offsetHeight) || (vw <= 520 ? 700 : 780);
  if (baseH <= 0) return 1;

  const availableForPhoneH = vh - safeTop - dockHeight - dockGap - bottomReserve;
  const rawScale = availableForPhoneH / baseH;
  const clampedScale = Math.max(MIN_TUTORIAL_PHONE_SCALE, Math.min(1, Number(rawScale.toFixed(4))));

  tutorial.phoneScale = clampedScale;
  if (phoneStageEl.style) {
    const fitH = `${Math.ceil(baseH * clampedScale)}px`;
    if (typeof phoneStageEl.style.setProperty === "function") {
      phoneStageEl.style.setProperty("--phone-scale", String(clampedScale));
      phoneStageEl.style.setProperty("--phone-fit-h", fitH);
    } else {
      phoneStageEl.style["--phone-scale"] = String(clampedScale);
      phoneStageEl.style["--phone-fit-h"] = fitH;
    }
  }
  if (phoneStageEl.dataset) {
    phoneStageEl.dataset.tutorialScaled = clampedScale < 0.999 ? "true" : "false";
  }
  return clampedScale;
}

function getVisibleFraction(el, safeTop, vh) {
  if (!el || typeof el.getBoundingClientRect !== "function" || vh <= 0) return 1;
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0) return 1;
  const visiblePx = Math.max(0, Math.min(vh, rect.bottom) - Math.max(safeTop, rect.top));
  return visiblePx / rect.height;
}

function performGuidedScroll(targetY, { instant = false } = {}) {
  if (typeof window.scrollTo !== "function") return;
  const vh = getViewportHeight();
  const docScrollHeight = Number(document.documentElement?.scrollHeight || 0);
  const maxScrollY = docScrollHeight > vh && vh > 0 ? Math.max(0, docScrollHeight - vh) : Infinity;
  const clampedTarget = Math.max(0, Math.min(maxScrollY, Math.round(targetY)));
  const currentY = getCurrentScrollY();
  tutorial.lastViewportW = getViewportWidth();
  tutorial.lastViewportH = vh;
  if (Math.abs(clampedTarget - currentY) < 4) {
    tutorial.lastGuidedScrollY = Math.round(currentY);
    return;
  }
  const reduceMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  const useInstant = reduceMotion || instant;
  tutorial.scrollStartY = currentY;
  tutorial.lastGuidedScrollY = clampedTarget;
  tutorial.programmaticScrollUntil = Date.now() + (useInstant ? 80 : 750);
  window.scrollTo({
    top: clampedTarget,
    behavior: useInstant ? "auto" : "smooth",
  });
  if (Math.abs(getCurrentScrollY() - clampedTarget) <= 4) {
    tutorial.programmaticScrollUntil = 0;
  }
}

function ensureTutorialViewportVisible({ reason = "auto", stage = null } = {}) {
  if (!tutorial.active) return;
  if (typeof window.scrollTo !== "function") return;
  if ((reason === "auto" || reason === "resize") && tutorial.userScrolledAway) return;

  const vh = getViewportHeight();
  if (vh <= 0) return;
  const safeTop = getStickyHeaderClearance();
  const scrollY = getCurrentScrollY();
  const instant = reason === "resize";

  if (stage?.id === "inspector" && inspectorShellEl && typeof inspectorShellEl.getBoundingClientRect === "function") {
    const inspRect = inspectorShellEl.getBoundingClientRect();
    const inspVis = getVisibleFraction(inspectorShellEl, safeTop, vh);
    if (inspRect.top >= safeTop - 4 && inspVis >= 0.7) {
      return;
    }
    performGuidedScroll(scrollY + inspRect.top - safeTop, { instant });
    return;
  }

  if (!tutorialDock || typeof tutorialDock.getBoundingClientRect !== "function") return;
  const dockRect = tutorialDock.getBoundingClientRect();
  const phoneRect = phoneBezelEl && typeof phoneBezelEl.getBoundingClientRect === "function"
    ? phoneBezelEl.getBoundingClientRect()
    : null;

  const combinedHeight = phoneRect ? Math.max(dockRect.height, phoneRect.bottom - dockRect.top) : dockRect.height;
  const canFitBoth = combinedHeight <= vh - safeTop + 2;
  const dockFullyVisible = dockRect.top >= safeTop - 2 && dockRect.bottom <= vh + 1;
  const phoneFullyVisible = phoneRect ? (phoneRect.top >= safeTop - 2 && phoneRect.bottom <= vh + 1) : true;

  if (reason !== "start" && canFitBoth && dockFullyVisible && phoneFullyVisible) {
    return;
  }

  let targetY = Math.max(0, scrollY + dockRect.top - safeTop);

  // When simultaneous full visibility of dock + readable phone is physically impossible,
  // anchor to reachable playback controls while maximizing visible phone area below.
  if (!canFitBoth && phoneRect && phoneRect.height > 0) {
    const projectedPhoneTop = scrollY + phoneRect.top - targetY;
    const projectedVisible = Math.max(
      0,
      Math.min(vh, projectedPhoneTop + phoneRect.height) - Math.max(safeTop, projectedPhoneTop),
    );
    if (projectedVisible / phoneRect.height < 0.55) {
      const controlsRect = tutorialControlsEl?.getBoundingClientRect();
      const anchorTop = controlsRect && controlsRect.height < vh - safeTop
        ? Math.min(controlsRect.top, phoneRect.top)
        : phoneRect.top;
      targetY = Math.max(0, scrollY + anchorTop - safeTop);
    }
  }

  performGuidedScroll(targetY, { instant });
}

if (typeof window.addEventListener === "function") {
  const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
  const markManualScrollIntent = (e) => {
    if (!tutorial.active) return;
    if (phoneBody && typeof phoneBody.contains === "function" && e?.target && phoneBody.contains(e.target)) {
      return;
    }
    tutorial.programmaticScrollUntil = 0;
    tutorial.resizeIgnoreScrollUntil = 0;
  };
  window.addEventListener("wheel", markManualScrollIntent, { passive: true });
  window.addEventListener("touchmove", markManualScrollIntent, { passive: true });
  window.addEventListener(
    "keydown",
    (e) => {
      if (e && SCROLL_KEYS.has(e.key)) {
        markManualScrollIntent(e);
      }
    },
    { passive: true },
  );

  const handleTutorialResize = () => {
    if (!tutorial.active) return;
    tutorial.lastViewportW = getViewportWidth();
    tutorial.lastViewportH = getViewportHeight();
    tutorial.resizeIgnoreScrollUntil = Date.now() + 260;

    const applySettledResize = () => {
      tutorial.resizeRafId = null;
      if (!tutorial.active) return;
      tutorial.lastViewportW = getViewportWidth();
      tutorial.lastViewportH = getViewportHeight();
      tutorial.resizeIgnoreScrollUntil = Date.now() + 260;
      updateTutorialPhoneScale();
      if (!tutorial.userScrolledAway) {
        const stage = TUTORIAL_STAGES[tutorial.stageIndex];
        ensureTutorialViewportVisible({ reason: "resize", stage });
      }
    };

    cancelPendingResizeFrame();
    if (typeof window.requestAnimationFrame === "function") {
      tutorial.resizeRafId = window.requestAnimationFrame(applySettledResize);
    } else {
      applySettledResize();
    }
    tutorial.resizeSettleTimer = window.setTimeout(() => {
      tutorial.resizeSettleTimer = null;
      applySettledResize();
    }, 120);
  };
  window.addEventListener("resize", handleTutorialResize, { passive: true });
  window.visualViewport?.addEventListener?.("resize", handleTutorialResize, { passive: true });

  window.addEventListener(
    "scroll",
    () => {
      if (!tutorial.active || tutorial.lastGuidedScrollY === null) return;
      const curW = getViewportWidth();
      const curH = getViewportHeight();
      if (
        (tutorial.lastViewportW !== null && curW !== tutorial.lastViewportW) ||
        (tutorial.lastViewportH !== null && curH !== tutorial.lastViewportH)
      ) {
        return;
      }
      if (Date.now() < tutorial.resizeIgnoreScrollUntil) {
        return;
      }
      const curY = getCurrentScrollY();
      const dist = Math.abs(curY - tutorial.lastGuidedScrollY);
      if (Date.now() < tutorial.programmaticScrollUntil) {
        if (dist <= 4) {
          tutorial.programmaticScrollUntil = 0;
          return;
        }
        if (tutorial.scrollStartY !== null) {
          const intendedDelta = tutorial.lastGuidedScrollY - tutorial.scrollStartY;
          const movedWrongWay =
            (intendedDelta > 0 && curY < tutorial.scrollStartY - 24) ||
            (intendedDelta < 0 && curY > tutorial.scrollStartY + 24);
          const overshot =
            (intendedDelta > 0 && curY > tutorial.lastGuidedScrollY + 40) ||
            (intendedDelta < 0 && curY < tutorial.lastGuidedScrollY - 40);
          if (movedWrongWay || overshot) {
            tutorial.programmaticScrollUntil = 0;
            tutorial.userScrolledAway = true;
          }
        }
        return;
      }
      if (dist > 28) {
        tutorial.userScrolledAway = true;
      }
    },
    { passive: true },
  );
}

function clearTutorialTimers() {
  if (tutorial.stageTimer !== null) {
    window.clearTimeout(tutorial.stageTimer);
    tutorial.stageTimer = null;
  }
  if (tutorial.subTimer !== null) {
    window.clearTimeout(tutorial.subTimer);
    tutorial.subTimer = null;
  }
}

function updateTutorialUI() {
  if (!tutorialDock) return;
  tutorialDock.hidden = !tutorial.active;
  if (btnWatchTutorial) {
    btnWatchTutorial.setAttribute("aria-expanded", String(tutorial.active));
  }
  if (!tutorial.active) return;

  const total = TUTORIAL_STAGES.length;
  const stage = TUTORIAL_STAGES[tutorial.stageIndex];
  const stepNum = tutorial.stageIndex + 1;
  const pct = Math.round((stepNum / total) * 100);

  tutorialStepBadge.textContent = `Stage ${stepNum} / ${total}`;
  tutorialStageTitle.textContent = stage.title;
  tutorialNarration.textContent = stage.narration;

  if (tutorial.completed) {
    tutorialStateBadge.textContent = "Complete";
    tutorialStateBadge.dataset.state = "complete";
    btnTutPlayPause.textContent = "Replay";
    btnTutPlayPause.setAttribute("aria-pressed", "false");
  } else if (tutorial.playing) {
    tutorialStateBadge.textContent = "Playing";
    tutorialStateBadge.dataset.state = "playing";
    btnTutPlayPause.textContent = "Pause";
    btnTutPlayPause.setAttribute("aria-pressed", "true");
  } else {
    tutorialStateBadge.textContent = "Paused";
    tutorialStateBadge.dataset.state = "paused";
    btnTutPlayPause.textContent = "Play";
    btnTutPlayPause.setAttribute("aria-pressed", "false");
  }

  tutorialProgress.setAttribute("aria-valuenow", String(stepNum));
  tutorialProgress.setAttribute("aria-valuemax", String(total));
  tutorialProgressFill.style.width = `${pct}%`;

  btnTutPrev.disabled = tutorial.stageIndex === 0;
  btnTutNext.disabled = tutorial.stageIndex === total - 1;
}

function scheduleCurrentStage(runId) {
  if (!tutorial.active || !tutorial.playing) return;
  const stage = TUTORIAL_STAGES[tutorial.stageIndex];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof stage.subAction === "function" && !tutorial.subActionDone) {
    const subWait = reduceMotion ? 220 : (stage.subDelayMs || 1500);
    tutorial.subTimer = window.setTimeout(() => {
      tutorial.subTimer = null;
      if (!tutorial.active || !tutorial.playing || tutorial.runId !== runId || tutorial.subActionDone) return;
      tutorial.subActionDone = true;
      stage.subAction();
    }, subWait);
  }

  if (tutorial.stageIndex < TUTORIAL_STAGES.length - 1) {
    const waitMs = reduceMotion ? Math.max(1800, Math.round(stage.durationMs * 0.7)) : stage.durationMs;
    tutorial.stageTimer = window.setTimeout(() => {
      tutorial.stageTimer = null;
      if (!tutorial.active || !tutorial.playing || tutorial.runId !== runId) return;
      goToTutorialStage(tutorial.stageIndex + 1, { autoPlay: true });
    }, waitMs);
  }
}

function goToTutorialStage(index, { autoPlay = tutorial.playing, scrollReason = "auto" } = {}) {
  clearTutorialTimers();
  if (pendingPackReveal !== null) {
    settlePendingPackReveal({ renderNow: false });
  }
  tutorial.runId += 1;
  const currentRunId = tutorial.runId;

  const clamped = Math.max(0, Math.min(TUTORIAL_STAGES.length - 1, index));
  const isLast = clamped === TUTORIAL_STAGES.length - 1;

  tutorial.active = true;
  tutorial.stageIndex = clamped;
  tutorial.subActionDone = false;
  tutorial.completed = isLast;
  tutorial.playing = isLast ? false : Boolean(autoPlay);

  const stage = TUTORIAL_STAGES[clamped];
  stage.enter();
  updateTutorialUI();
  updateTutorialPhoneScale();
  ensureTutorialViewportVisible({ reason: scrollReason, stage });
  announce(`Tutorial stage ${clamped + 1} of ${TUTORIAL_STAGES.length}: ${stage.title}.`);

  if (!isLast && tutorial.playing) {
    scheduleCurrentStage(currentRunId);
  }
}

function startTutorial() {
  clearTutorialTimers();
  cancelPendingPackReveal();
  cancelPendingResizeFrame();
  sessionVersion += 1;
  tutorial.userScrolledAway = false;
  tutorial.lastGuidedScrollY = null;
  tutorial.scrollStartY = null;
  tutorial.programmaticScrollUntil = 0;
  tutorial.resizeIgnoreScrollUntil = 0;
  tutorial.lastViewportW = getViewportWidth();
  tutorial.lastViewportH = getViewportHeight();
  state = createInitialState();
  goToTutorialStage(0, { autoPlay: true, scrollReason: "start" });
}

function pauseTutorial({ silent = false } = {}) {
  if (!tutorial.active || !tutorial.playing) return;
  clearTutorialTimers();
  settlePendingPackReveal({ renderNow: true });
  tutorial.runId += 1;
  tutorial.playing = false;
  updateTutorialUI();
  if (!silent) announce("Tutorial paused.");
}

function resumeTutorial() {
  if (!tutorial.active) {
    startTutorial();
    return;
  }
  if (tutorial.completed || tutorial.stageIndex >= TUTORIAL_STAGES.length - 1) {
    startTutorial();
    return;
  }
  if (tutorial.playing) return;
  clearTutorialTimers();
  tutorial.runId += 1;
  tutorial.playing = true;
  updateTutorialUI();
  announce("Tutorial resumed.");
  scheduleCurrentStage(tutorial.runId);
}

function exitTutorial({ silent = false } = {}) {
  if (!tutorial.active && tutorial.stageTimer === null && tutorial.subTimer === null) return;
  if (Date.now() < tutorial.programmaticScrollUntil) {
    window.scrollTo({ top: getCurrentScrollY(), behavior: "instant" });
  }
  clearTutorialTimers();
  cancelPendingResizeFrame();
  settlePendingPackReveal({ renderNow: true });
  tutorial.runId += 1;
  tutorial.active = false;
  tutorial.playing = false;
  tutorial.subActionDone = false;
  tutorial.completed = false;
  tutorial.userScrolledAway = false;
  tutorial.lastGuidedScrollY = null;
  tutorial.scrollStartY = null;
  tutorial.programmaticScrollUntil = 0;
  tutorial.resizeIgnoreScrollUntil = 0;
  tutorial.lastViewportW = null;
  tutorial.lastViewportH = null;
  resetTutorialPhoneScale();
  updateTutorialUI();
  if (!silent) {
    announce("Exited guided tutorial. Exploring manually.");
    btnWatchTutorial?.focus({ preventScroll: true });
  }
}

// Persistent Topbar, Tutorial, Tour & Inspector Tab wiring
btnWatchTutorial?.addEventListener("click", () => {
  startTutorial();
  btnTutPlayPause?.focus({ preventScroll: true });
});

btnTutPlayPause?.addEventListener("click", () => {
  if (tutorial.completed) {
    startTutorial();
  } else if (tutorial.playing) {
    pauseTutorial();
  } else {
    resumeTutorial();
  }
});

btnTutPrev?.addEventListener("click", () => {
  if (!tutorial.active || tutorial.stageIndex <= 0) return;
  goToTutorialStage(tutorial.stageIndex - 1, { autoPlay: false, scrollReason: "step" });
});

btnTutNext?.addEventListener("click", () => {
  if (!tutorial.active || tutorial.stageIndex >= TUTORIAL_STAGES.length - 1) return;
  goToTutorialStage(tutorial.stageIndex + 1, { autoPlay: false, scrollReason: "step" });
});

btnTutRestart?.addEventListener("click", () => {
  startTutorial();
});

btnTutExit?.addEventListener("click", () => {
  exitTutorial();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && tutorial.active) {
    exitTutorial();
  }
});

// Pause auto-advance safely if user interacts directly inside the phone frame
phoneBody?.addEventListener("pointerdown", () => {
  if (tutorial.active && tutorial.playing) pauseTutorial({ silent: true });
});

document.querySelectorAll(".tour-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    if (tutorial.active) exitTutorial({ silent: true });
    const target = pill.dataset.tour;
    state.inspectorTab = "trace";
    if (target === "welcome") {
      state.isLoggedIn = false;
      state.token = null;
      state.screen = "welcome";
      render();
    } else if (target === "pack-diamond") {
      navigate("pack-detail", { packId: "diamond" });
    } else if (target === "player-card") {
      navigate("player-detail", { playerId: PLAYERS[0].id, from: "players" });
    } else {
      navigate(target);
    }
  });
});

const inspectorTabs = Array.from(document.querySelectorAll(".inspector-tab"));
inspectorTabs.forEach((tab, idx) => {
  tab.addEventListener("click", () => {
    if (tutorial.active && tutorial.playing) pauseTutorial({ silent: true });
    state.inspectorTab = tab.dataset.inspector;
    render();
  });
  tab.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      if (tutorial.active && tutorial.playing) pauseTutorial({ silent: true });
      const next = e.key === "ArrowRight" ? (idx + 1) % inspectorTabs.length : (idx - 1 + inspectorTabs.length) % inspectorTabs.length;
      state.inspectorTab = inspectorTabs[next].dataset.inspector;
      render();
      inspectorTabs[next].focus();
    }
  });
});

document.getElementById("btnAddCredits").addEventListener("click", () => {
  state.credits += 1000;
  announce(`Added 1,000 demo credits. Balance is now ${state.credits}.`);
  render();
});

document.getElementById("btnResetDemo").addEventListener("click", () => {
  cancelPendingPackReveal();
  sessionVersion += 1;
  if (tutorial.active) exitTutorial({ silent: true });
  clearTutorialTimers();
  state = createInitialState();
  announce("Demo session reset to initial state.");
  render();
});

// Deterministic read-only inspection handle for automated browser verification
window.__FB_TUTORIAL__ = {
  getState: () => ({
    active: tutorial.active,
    playing: tutorial.playing,
    completed: tutorial.completed,
    stageIndex: tutorial.stageIndex,
    stageId: TUTORIAL_STAGES[tutorial.stageIndex]?.id || null,
    subActionDone: tutorial.subActionDone,
    userScrolledAway: tutorial.userScrolledAway,
    lastGuidedScrollY: tutorial.lastGuidedScrollY,
    phoneScale: tutorial.phoneScale,
    totalStages: TUTORIAL_STAGES.length,
    hasPendingTimers: tutorial.stageTimer !== null || tutorial.subTimer !== null || pendingPackReveal !== null,
    hasPendingPackReveal: pendingPackReveal !== null,
    screen: state.screen,
    inspectorTab: state.inspectorTab,
    isCardFlipped: state.isCardFlipped,
    credits: state.credits,
    myCardsCount: state.myCards.length,
    packSpinning: state.packSpinning,
    packOpenedDone: state.packOpenedDone,
    lastOpenedPlayerName: state.lastOpenedPlayer?.name || null,
    filters: { ...state.filters },
    filteredPlayersCount: getFilteredPlayers().length,
  }),
  stages: TUTORIAL_STAGES.map((s, idx) => ({ index: idx, id: s.id, title: s.title, tourKey: s.tourKey })),
};

render();
