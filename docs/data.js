// Source-grounded dataset for the Fantasy Basketball public static showcase.
// - Preserves all 4 real clubs and 8 real players from the original repository.
// - Stephen Curry's attributes come verbatim from `frontend/FantasyBasketball/PlayerDetailView.swift:297-314`.
// - Because `db.sqlite3` was untracked in commit 9d0362f, ratings/bios for the other 7 players are
//   illustrative demo values aligned to `PlayerSerializer` choices and `Player.save()` rarity thresholds
//   (not official NBA/EuroLeague statistics).
// - All portraits in `docs/assets/players/` and `docs/assets/court-bg.jpg` are verified Creative Commons
//   photographs from Wikimedia Commons (see `docs/THIRD-PARTY-NOTICES.md`).
// - Team badges in `docs/assets/teams/` and `docs/assets/basketball-logo.svg` are original author-created SVGs.

export const STARTING_CREDITS = 1000;

export const RARITY_META = {
  DarkBlueDiamond: { label: "Dark Blue Diamond", minOvr: 95 },
  PinkDiamond: { label: "Pink Diamond", minOvr: 90 },
  Diamond: { label: "Diamond", minOvr: 85 },
  Amethyst: { label: "Amethyst", minOvr: 80 },
  Ruby: { label: "Ruby", minOvr: 75 },
  Gold: { label: "Gold", minOvr: 55 },
};

export function rarityFromRating(ovr) {
  if (ovr >= 95) return "DarkBlueDiamond";
  if (ovr >= 90) return "PinkDiamond";
  if (ovr >= 85) return "Diamond";
  if (ovr >= 80) return "Amethyst";
  if (ovr >= 75) return "Ruby";
  return "Gold";
}

// Mirrors MarketplaceView.swift `samplePacks` + backend/myapp/views.py `OpenCardPackView` exactly.
export const CARD_PACKS = [
  {
    id: "gold",
    name: "Gold Pack",
    price: 500,
    swiftDescription: "1 card – %2 Ruby",
    weights: {
      Gold: 90,
      Ruby: 5,
      Amethyst: 3,
      Diamond: 1,
      PinkDiamond: 0.5,
      DarkBlueDiamond: 0.5,
    },
  },
  {
    id: "amethyst",
    name: "Amethyst Pack",
    price: 800,
    swiftDescription: "1 card – %2 Amethyst",
    weights: {
      Gold: 70,
      Ruby: 15,
      Amethyst: 8,
      Diamond: 4,
      PinkDiamond: 2,
      DarkBlueDiamond: 1,
    },
  },
  {
    id: "diamond",
    name: "Diamond Pack",
    price: 1000,
    swiftDescription: "1 card – %2 Diamond",
    weights: {
      Gold: 60,
      Ruby: 16,
      Amethyst: 10,
      Diamond: 8,
      PinkDiamond: 4,
      DarkBlueDiamond: 2,
    },
  },
];

// The 4 real clubs from the repository paired with original geometric monogram badges
export const TEAMS = [
  {
    id: 1,
    name: "Golden State Warriors",
    city: "San Francisco",
    established_year: 1946,
    arena_name: "Chase Center",
    logo: "assets/teams/gsw.svg",
  },
  {
    id: 2,
    name: "Los Angeles Lakers",
    city: "Los Angeles",
    established_year: 1947,
    arena_name: "Crypto.com Arena",
    logo: "assets/teams/lal.svg",
  },
  {
    id: 3,
    name: "Phoenix Suns",
    city: "Phoenix",
    established_year: 1968,
    arena_name: "Footprint Center",
    logo: "assets/teams/phx.svg",
  },
  {
    id: 4,
    name: "Fenerbahçe Beko",
    city: "Istanbul",
    established_year: 1913,
    arena_name: "Ülker Sports Arena",
    logo: "assets/teams/fb.svg",
  },
];

// All 8 real players from the repository paired with verified Creative Commons portraits (see THIRD-PARTY-NOTICES.md)
const RAW_PLAYERS = [
  {
    id: 1,
    name: "Stephen Curry",
    team: 1,
    position: "Guard",
    age: 36,
    height: 188,
    weight: 84,
    overall_rating: 97,
    experience_years: 14,
    nationality: "USA",
    best_skill: "three_point_shooting",
    bio: "Chef Curry",
    profile_picture: "assets/players/curry.jpg",
    provenance: "verbatim_swift_preview",
    photoCredit: "Photo: Keith Allison (CC BY-SA 2.0, Wikimedia Commons, cropped)",
    photoUrl: "https://commons.wikimedia.org/wiki/File:Stephen_Curry_(24511268640)_(cropped).jpg",
  },
  {
    id: 2,
    name: "LeBron James",
    team: 2,
    position: "Forward",
    age: 40,
    height: 206,
    weight: 113,
    overall_rating: 96,
    experience_years: 21,
    nationality: "USA",
    best_skill: "leadership",
    bio: "Demo card profile: all-around playmaking forward and veteran floor leader.",
    profile_picture: "assets/players/lebron.jpg",
    provenance: "demo_reconstructed",
    photoCredit: "Photo: Erik Drost (CC BY 2.0, Wikimedia Commons, cropped)",
    photoUrl: "https://commons.wikimedia.org/wiki/File:LeBron_James_(51959977144)_(cropped2).jpg",
  },
  {
    id: 3,
    name: "Kevin Durant",
    team: 3,
    position: "Forward",
    age: 36,
    height: 211,
    weight: 109,
    overall_rating: 94,
    experience_years: 16,
    nationality: "USA",
    best_skill: "mid_range_shooting",
    bio: "Demo card profile: three-level scorer with effortless pull-up length.",
    profile_picture: "assets/players/durant.jpg",
    provenance: "demo_reconstructed",
    photoCredit: "Photo: Clément Bardot (CC BY-SA 4.0, Wikimedia Commons, cropped)",
    photoUrl: "https://commons.wikimedia.org/wiki/File:Kevin_Durant,_Paris_2024_(cropped).jpg",
  },
  {
    id: 4,
    name: "Devin Booker",
    team: 3,
    position: "Guard",
    age: 28,
    height: 198,
    weight: 93,
    overall_rating: 91,
    experience_years: 9,
    nationality: "USA",
    best_skill: "shooting",
    bio: "Demo card profile: smooth perimeter scorer and secondary pick-and-roll creator.",
    profile_picture: "assets/players/booker.jpg",
    provenance: "demo_reconstructed",
    photoCredit: "Photo: Clément Bardot (CC BY-SA 4.0, Wikimedia Commons, cropped)",
    photoUrl: "https://commons.wikimedia.org/wiki/File:Devin_Booker,_Olympic_Games_2024_(cropped).jpg",
  },
  {
    id: 5,
    name: "Jimmy Butler",
    team: 1,
    position: "Forward",
    age: 35,
    height: 201,
    weight: 104,
    overall_rating: 89,
    experience_years: 13,
    nationality: "USA",
    best_skill: "clutch",
    bio: "Demo card profile: physical two-way wing known for late-game composure and defense.",
    profile_picture: "assets/players/butler.jpg",
    provenance: "demo_reconstructed",
    photoCredit: "Photo: Joe Glorioso (CC BY-SA 2.0, Wikimedia Commons, cropped)",
    photoUrl: "https://commons.wikimedia.org/wiki/File:Jimmy_Butler_(cropped).jpg",
  },
  {
    id: 6,
    name: "Nigel Hayes-Davis",
    team: 4,
    position: "Forward",
    age: 30,
    height: 203,
    weight: 103,
    overall_rating: 84,
    experience_years: 7,
    nationality: "USA",
    best_skill: "athleticism",
    bio: "Demo card profile: versatile stretch forward anchoring Istanbul frontcourt lineups.",
    profile_picture: "assets/players/nigel.jpg",
    provenance: "demo_reconstructed",
    photoCredit: "Photo: Zafer (CC BY-SA 4.0, Wikimedia Commons, cropped)",
    photoUrl: "https://commons.wikimedia.org/wiki/File:Nigel_Hayes_11_Fenerbah%C3%A7e_Basketball_20220925_(1)_(cropped).jpg",
  },
  {
    id: 7,
    name: "Marko Gudurić",
    team: 4,
    position: "Guard",
    age: 29,
    height: 198,
    weight: 91,
    overall_rating: 78,
    experience_years: 9,
    nationality: "Serbia",
    best_skill: "playmaking",
    bio: "Demo card profile: left-handed combo guard creating perimeter spacing and late-clock reads.",
    profile_picture: "assets/players/guduric.jpg",
    provenance: "demo_reconstructed",
    photoCredit: "Photo: Zafer (CC BY 4.0, Wikimedia Commons, cropped)",
    photoUrl: "https://commons.wikimedia.org/wiki/File:Marko_Guduri%C4%87_23_Fenerbah%C3%A7e_Basketbol_Euroleague_20250325_(1).jpg",
  },
  {
    id: 8,
    name: "Bronny James",
    team: 2,
    position: "Guard",
    age: 20,
    height: 188,
    weight: 95,
    overall_rating: 72,
    experience_years: 1,
    nationality: "USA",
    best_skill: "defense",
    bio: "Demo card profile: young perimeter guard focusing on on-ball defense and transition energy.",
    profile_picture: "assets/players/bronny.jpg",
    provenance: "demo_reconstructed",
    photoCredit: "Photo: Erik Drost (CC BY 4.0, Wikimedia Commons, cropped)",
    photoUrl: "https://commons.wikimedia.org/wiki/File:Bronny_James_Jr._(55095342116)_(cropped).jpg",
  },
];

const TEAM_MAP = Object.fromEntries(TEAMS.map((t) => [t.id, t]));

export const PLAYERS = RAW_PLAYERS.map((p) => ({
  ...p,
  team_name: TEAM_MAP[p.team].name,
  rarity: rarityFromRating(p.overall_rating),
}));

export const POSITIONS = ["All", ...Array.from(new Set(PLAYERS.map((p) => p.position))).sort()];
export const NATIONALITIES = ["All", ...Array.from(new Set(PLAYERS.map((p) => p.nationality))).sort()];

// Verified Backend-Only League & Standings endpoints (implemented in backend/myapp/views.py, not wired in SwiftUI).
export const BACKEND_LEAGUE_STEPS = [
  {
    id: "list",
    title: "1. List Active Leagues",
    method: "GET",
    endpoint: "/api/leagues/",
    permission: "IsAuthenticated",
    djangoView: "LeagueListView",
    summary: "Returns active leagues configured in Django. Users inspect capacity and start dates before submitting a 10-player roster.",
    request: null,
    status: 200,
    response: [
      {
        id: 1,
        name: "Graduation Demo League",
        description: "4-manager demonstration league",
        start_date: "2026-11-22",
        end_date: "2026-12-06",
        max_players: 4,
        active: true,
        current_day: 1,
        status: "pending",
      },
    ],
  },
  {
    id: "join",
    title: "2. Join League (10 Roster / 5 Starters)",
    method: "POST",
    endpoint: "/api/join-league/",
    permission: "IsAuthenticated",
    djangoView: "JoinLeagueView",
    summary: "Validates 10 unique existing player IDs and 5 starting-five IDs as a subset, then writes UserLeague + 10 UserLeaguePlayer rows atomically (Phase 2A fixed the `team=` FK mismatch).",
    request: {
      league_id: 1,
      player_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      starting_five_ids: [1, 2, 3, 4, 5],
    },
    status: 201,
    response: {
      message: "Successfully joined the league and created team!",
    },
  },
  {
    id: "start",
    title: "3. Generate Round-Robin Schedule",
    method: "POST",
    endpoint: "/api/start-league-manual/1/",
    permission: "IsAdminUser (Staff Only)",
    djangoView: "start_league_manual",
    summary: "Hardened in Phase 2A from unsafe GET to staff-only POST, preventing duplicate schedules and correcting invalid status `'ongoing'` to `'in_progress'`.",
    request: {},
    status: 200,
    response: {
      message: "League matches created successfully.",
      match_count: 6,
    },
  },
  {
    id: "record",
    title: "4. Record Match Result",
    method: "POST",
    endpoint: "/api/record-match/",
    permission: "IsAdminUser (Staff Only)",
    djangoView: "RecordMatchResultView",
    summary: "Restricted to staff in Phase 2A with non-negative integer score validation. Atomically updates Match winner/status and records PlayerStats.",
    request: {
      match_id: 1,
      score1: 112,
      score2: 104,
    },
    status: 200,
    response: {
      message: "Match result recorded.",
    },
  },
  {
    id: "standings",
    title: "5. Query League Standings",
    method: "GET",
    endpoint: "/api/standings/?league_id=1",
    permission: "IsAuthenticated",
    djangoView: "LeagueStandingsView",
    summary: "Computes wins, losses, and 3-point table rankings from finished Match records sorted descending by points.",
    request: null,
    status: 200,
    response: [
      { player_id: 1, username: "hoopfan", wins: 3, losses: 0, points: 9 },
      { player_id: 2, username: "rival99", wins: 2, losses: 1, points: 6 },
      { player_id: 3, username: "coach_ist", wins: 1, losses: 2, points: 3 },
      { player_id: 4, username: "court_mgr", wins: 0, losses: 3, points: 0 },
    ],
  },
];
