export interface FightRecord {
  opponent: string;
  result: "W" | "L" | "NC";
  method: string;
  event: string;
  round: number;
  date: string;
}

export interface FighterStats {
  age: number;
  height: string;
  weight: string;
  reach: string;
  stance: string;
  country: string;
  gym: string;

  wins: number;
  losses: number;
  draws: number;

  // Striking (UFCStats)
  sigStrikesLanded: number;    // per min
  sigStrikesAbsorbed: number;  // per min
  sigStrikeAccuracy: number;   // %
  sigStrikeDefense: number;    // %
  knockdownAvg: number;        // knockdowns LANDED per 15 min

  // Grappling
  takedownAvg: number;
  takedownAccuracy: number;
  takedownDefense: number;
  submissionAvg: number;

  // Finish breakdown
  koTkoWins: number;
  submissionWins: number;
  ufcKoLosses: number;
  careerKoLosses: number;
  knockdownsAbsorbed: number;

  // Record context
  winsAsFavorite: number;
  lossesAsFavorite: number;
  winsAsUnderdog: number;
  lossesAsUnderdog: number;

  lastFights: FightRecord[];
}

export interface Fighter {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  ranking?: number;
  weightClass: string;
  nationality: string;
  imageUrls: string[];
  stats: FighterStats;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number, min = 1, max = 10) {
  return Math.min(max, Math.max(min, Math.round(v * 10) / 10));
}

function cdnUrls(last: string, first: string, dates: string[]): string[] {
  return dates.map(
    (d) =>
      `https://ufc.com/images/styles/athlete_bio_full_body/s3/${d}/${last}_${first}_L_${d.replace("-", "")}.png`
  );
}

// ─── Skill score computation ──────────────────────────────────────────────────

export interface SkillScores {
  boxing: number;
  kickboxing: number;
  grappling: number;
  bjj: number;
  durability: number;
  standUpDefense: number;
}

export function computeSkillScores(f: Fighter): SkillScores {
  const s = f.stats;

  // Boxing: based on volume (SLpM), accuracy, total KO wins, knockdown avg, finishing power
  const boxing = clamp(
    3.5 +
      (s.sigStrikesLanded / 6) * 2.0 +       // volume component (max ~2.0 at 6 SLpM)
      (s.sigStrikeAccuracy / 100) * 2.0 +    // accuracy (max 2.0)
      s.koTkoWins * 0.3 +                    // KO finishing power
      s.knockdownAvg * 1.2                   // ability to drop opponents
  );

  // Kickboxing: volume + defense + variety (accuracy as proxy for technique)
  const kickboxing = clamp(
    3.5 +
      (s.sigStrikesLanded / 6) * 1.8 +
      (s.sigStrikeDefense / 100) * 2.0 +
      s.koTkoWins * 0.25 +
      (s.sigStrikeAccuracy / 100) * 1.2
  );

  // Grappling: TD volume, accuracy, defense
  const grappling = clamp(
    3.5 +
      Math.min(s.takedownAvg / 4, 1) * 2.5 +
      (s.takedownAccuracy / 100) * 1.5 +
      (s.takedownDefense / 100) * 2.0
  );

  // BJJ: submission wins, sub avg, grappling base
  const bjj = clamp(
    3.0 +
      s.submissionWins * 0.35 +
      Math.min(s.submissionAvg / 3, 1) * 2.5 +
      (s.takedownDefense / 100) * 1.0
  );

  // Durability: penalise UFC KO losses heavily, career KO losses moderately, knockdowns and high absorption
  const durability = clamp(
    8.5 -
      s.ufcKoLosses * 1.3 -
      (s.careerKoLosses - s.ufcKoLosses) * 0.5 -
      s.knockdownsAbsorbed * 0.35 -
      (s.sigStrikesAbsorbed > 4.5 ? 0.8 : s.sigStrikesAbsorbed > 3.5 ? 0.4 : 0)
  );

  // Stand-up defense: lower SApM = better, higher str defense % = better
  const standUpDefense = clamp(
    10 - s.sigStrikesAbsorbed * 0.85 + (s.sigStrikeDefense - 50) * 0.04
  );

  return { boxing, kickboxing, grappling, bjj, durability, standUpDefense };
}

// ─── Recent-form score ────────────────────────────────────────────────────────
// Weights by recency, org level, and finish quality

function orgWeight(event: string): number {
  if (/^ufc/i.test(event)) return 1.0;                        // UFC = full weight
  if (/rizin|pfl|one\s|bellator/i.test(event)) return 0.82;  // Major orgs
  return 0.55;                                                  // Regional / unknown
}

function finishWeight(method: string, round: number): number {
  const isFinish = /ko|tko|sub/i.test(method);
  if (!isFinish) return 1.0;           // Decision
  if (round === 1) return 1.45;        // First-round finish: elite danger
  if (round === 2) return 1.25;        // Second-round finish: strong
  return 1.10;                         // Later finish: still a bonus
}

export function computeRecentFormScore(fights: FightRecord[]): number {
  const last5 = fights.slice(0, 5);
  const recencyWeights = [5, 4, 3, 2, 1];
  let wWins = 0, wTotal = 0;
  last5.forEach((f, i) => {
    const rw = recencyWeights[i] ?? 1;
    const ow = orgWeight(f.event);
    const fw = f.result === "W" ? finishWeight(f.method, f.round) : 1.0;
    const totalW = rw * ow;
    wTotal += totalW;
    if (f.result === "W") wWins += totalW * fw;
  });
  return wTotal > 0 ? Math.min(wWins / wTotal, 1) : 0.5;
}

// ─── Age factor ──────────────────────────────────────────────────────────────
// Peak MMA age ~28–32. Penalise fighters on either side.

function ageFactor(age: number): number {
  if (age < 24) return -0.04;          // Young / inexperienced
  if (age <= 32) return 0;             // Peak window
  if (age <= 35) return -(age - 32) * 0.012;  // Mild decline
  return -(age - 32) * 0.022;          // Steeper decline 36+
}

// ─── Win probability ─────────────────────────────────────────────────────────
// 50% recent form (org + finish weighted) · 35% skills · 15% age

export function computeWinProbability(
  f1: Fighter,
  f2: Fighter
): { prob1: number; prob2: number } {
  const s1 = computeSkillScores(f1);
  const s2 = computeSkillScores(f2);

  const avg = (s: SkillScores) =>
    (s.boxing + s.kickboxing + s.grappling + s.bjj + s.durability) / 5;

  const skillTotal = avg(s1) + avg(s2) || 1;
  const sp1 = avg(s1) / skillTotal;

  const form1 = computeRecentFormScore(f1.stats.lastFights);
  const form2 = computeRecentFormScore(f2.stats.lastFights);
  const formTotal = form1 + form2 || 1;
  const fp1 = form1 / formTotal;

  // Age-adjusted component: shift from 0.5 baseline
  const ageAdj1 = 0.5 + ageFactor(f1.stats.age) - ageFactor(f2.stats.age);

  const raw1 = fp1 * 0.50 + sp1 * 0.35 + ageAdj1 * 0.15;
  const raw2 = (1 - fp1) * 0.50 + (1 - sp1) * 0.35 + (1 - ageAdj1) * 0.15;
  const rawTotal = raw1 + raw2;

  return {
    prob1: Math.round((raw1 / rawTotal) * 1000) / 10,
    prob2: Math.round((raw2 / rawTotal) * 1000) / 10,
  };
}

// ─── Fighter roster ──────────────────────────────────────────────────────────

export const FIGHTERS: Record<string, Fighter> = {
  // ── MAIN EVENT ──────────────────────────────────────────────────────────────
  moicano: {
    id: "moicano",
    name: "Renato Moicano",
    firstName: "Renato",
    lastName: "Moicano",
    nickname: "Money",
    ranking: 10,
    weightClass: "Lightweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/PEREIRA_ALICE_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/COWAN_HAILEY_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/FLOWERS_DARRIUS_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/VANNATA_LANDO_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/HOPE_DAKOTA_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/KAMAKA_KAI_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/GATTO_MELISSA_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/BARBOSA_DIONE_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/GORE_TRESEAN_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/BEKOEV_AZAMAT_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/NICOLL_STEWART_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/COSTA_ALESSANDRO_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/PETERSEN_THOMAS_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/PAT_GUILHERME_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/RUCHALA_ROBERT_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/DELANO_JOSEMAURO_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/ZECCHINI_MANOLO_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/MCMILLEN_TOMMY_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/ESTEVAM_RAFAEL_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/EWING_ETHYN_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/RIBEIRO_BRENDSON_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/YAKHYAEV_ABDULRAKHMAN_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/MOICANO_RENATO_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-06/MOICANO_RENATO_L_06-28.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-01/MOICANO_RENATO_L_01-18.png",
    ],
    stats: {
      age: 36, height: "5'11\"", weight: "155 lbs", reach: "75\"",
      stance: "Orthodox", country: "Brazil", gym: "Evolve MMA",
      wins: 20, losses: 7, draws: 1,
      sigStrikesLanded: 4.17, sigStrikesAbsorbed: 3.57,
      sigStrikeAccuracy: 37, sigStrikeDefense: 59,
      knockdownAvg: 0.44,
      takedownAvg: 1.67, takedownAccuracy: 44, takedownDefense: 62, submissionAvg: 1.4,
      koTkoWins: 2, submissionWins: 6, ufcKoLosses: 3, careerKoLosses: 3, knockdownsAbsorbed: 1,
      winsAsFavorite: 5, lossesAsFavorite: 3, winsAsUnderdog: 7, lossesAsUnderdog: 4,
      lastFights: [
        { opponent: "Beneil Dariush",     result: "L", method: "DEC (Unanimous)",      event: "UFC 317",              round: 3, date: "Jun 28, 2025" },
        { opponent: "Islam Makhachev",    result: "L", method: "SUB (RNC)",            event: "UFC 311",              round: 1, date: "Jan 18, 2025" },
        { opponent: "Benoit Saint-Denis", result: "W", method: "TKO (Doctor Stop)",    event: "UFC Fight Night Paris", round: 2, date: "Sep 28, 2024" },
        { opponent: "Jalin Turner",       result: "W", method: "TKO (Ground & Pound)", event: "UFC 300",              round: 2, date: "Apr 13, 2024" },
        { opponent: "Drew Dober",         result: "W", method: "DEC (Unanimous)",      event: "UFC Fight Night",       round: 3, date: "Feb 3, 2024" },
      ],
    },
  },

  duncan: {
    id: "duncan",
    name: "Chris Duncan",
    firstName: "Chris",
    lastName: "Duncan",
    nickname: "The Problem",
    weightClass: "Lightweight",
    nationality: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/DUNCAN_CHRIS_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-12/DUNCAN_CHRIS_L_12-06.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-08/DUNCAN_CHRIS_L_08-02.png",
    ],
    stats: {
      age: 32, height: "5'10\"", weight: "155 lbs", reach: "72\"",
      stance: "Orthodox", country: "Scotland", gym: "American Top Team",
      wins: 15, losses: 2, draws: 0,
      sigStrikesLanded: 5.02, sigStrikesAbsorbed: 4.82,
      sigStrikeAccuracy: 43, sigStrikeDefense: 51,
      knockdownAvg: 0.18,
      takedownAvg: 3.27, takedownAccuracy: 42, takedownDefense: 50, submissionAvg: 2.8,
      koTkoWins: 0, submissionWins: 8, ufcKoLosses: 0, careerKoLosses: 1, knockdownsAbsorbed: 0,
      winsAsFavorite: 6, lossesAsFavorite: 1, winsAsUnderdog: 5, lossesAsUnderdog: 1,
      lastFights: [
        { opponent: "Terrance McKinney", result: "W", method: "SUB (Anaconda)",   event: "UFC 323",               round: 1, date: "Dec 6, 2025" },
        { opponent: "Mateusz Rebecki",   result: "W", method: "DEC (Unanimous)",  event: "UFC on ESPN",           round: 3, date: "Aug 2, 2025" },
        { opponent: "Jordan Vucenic",    result: "W", method: "SUB (Guillotine)", event: "UFC Fight Night London", round: 2, date: "Mar 22, 2025" },
        { opponent: "Bolaji Oki",        result: "W", method: "SUB (Guillotine)", event: "UFC Fight Night Paris",  round: 1, date: "Sep 28, 2024" },
        { opponent: "Manuel Torres",     result: "L", method: "SUB (RNC)",        event: "UFC Fight Night",        round: 1, date: "Feb 24, 2024" },
      ],
    },
  },

  // ── CO-MAIN ──────────────────────────────────────────────────────────────────
  jandiroba: {
    id: "jandiroba",
    name: "Virna Jandiroba",
    firstName: "Virna",
    lastName: "Jandiroba",
    nickname: "Carcará",
    ranking: 3,
    weightClass: "Women's Strawweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/JANDIROBA_VIRNA_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-10/JANDIROBA_VIRNA_L_10-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-10/JANDIROBA_VIRNA_L_10-05.png",
    ],
    stats: {
      age: 37, height: "5'5\"", weight: "115 lbs", reach: "64\"",
      stance: "Orthodox", country: "Brazil", gym: "Fight Sports",
      wins: 22, losses: 4, draws: 0,
      sigStrikesLanded: 3.48, sigStrikesAbsorbed: 2.61,
      sigStrikeAccuracy: 42, sigStrikeDefense: 63,
      knockdownAvg: 0.05,
      takedownAvg: 5.18, takedownAccuracy: 53, takedownDefense: 71, submissionAvg: 2.1,
      koTkoWins: 0, submissionWins: 9, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 7, lossesAsFavorite: 2, winsAsUnderdog: 4, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Mackenzie Dern",  result: "L", method: "DEC (Unanimous)", event: "UFC 321",             round: 5, date: "Oct 4, 2025" },
        { opponent: "Amanda Lemos",    result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night",     round: 3, date: "Mar 22, 2025" },
        { opponent: "Loopy Godinez",   result: "W", method: "SUB (Triangle)", event: "UFC Fight Night",     round: 2, date: "Sep 14, 2024" },
        { opponent: "Tecia Pennington",result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night",     round: 3, date: "Mar 30, 2024" },
        { opponent: "Michelle Waterson",result:"W", method: "SUB (RNC)",       event: "UFC Fight Night",     round: 2, date: "Nov 11, 2023" },
      ],
    },
  },

  ricci: {
    id: "ricci",
    name: "Tabatha Ricci",
    firstName: "Tabatha",
    lastName: "Ricci",
    nickname: "Baby Shark",
    ranking: 11,
    weightClass: "Women's Strawweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-04/RICCI_TABATHA_L_04-04.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-07/RICCI_TABATHA_L_07-12.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-11/RICCI_TABATHA_L_11-23.png",
    ],
    stats: {
      age: 29, height: "5'6\"", weight: "115 lbs", reach: "66\"",
      stance: "Orthodox", country: "Brazil", gym: "Xtreme Couture",
      wins: 12, losses: 3, draws: 0,
      sigStrikesLanded: 4.12, sigStrikesAbsorbed: 3.88,
      sigStrikeAccuracy: 44, sigStrikeDefense: 57,
      knockdownAvg: 0.12,
      takedownAvg: 2.44, takedownAccuracy: 44, takedownDefense: 64, submissionAvg: 1.2,
      koTkoWins: 2, submissionWins: 4, ufcKoLosses: 1, careerKoLosses: 1, knockdownsAbsorbed: 1,
      winsAsFavorite: 5, lossesAsFavorite: 1, winsAsUnderdog: 3, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Amanda Ribas",      result: "W", method: "TKO (Punches)",  event: "UFC Fight Night",  round: 2, date: "Jul 12, 2025" },
        { opponent: "Xiaonan Yan",       result: "L", method: "DEC (Unanimous)",event: "UFC Fight Night",  round: 3, date: "Nov 23, 2024" },
        { opponent: "Polyana Viana",     result: "W", method: "DEC (Unanimous)",event: "UFC Fight Night",  round: 3, date: "Mar 30, 2024" },
        { opponent: "Angela Hill",       result: "W", method: "DEC (Unanimous)",event: "UFC Fight Night",  round: 3, date: "Feb 17, 2024" },
        { opponent: "Randa Markos",      result: "W", method: "SUB (RNC)",      event: "UFC Fight Night",  round: 2, date: "Sep 9, 2023" },
      ],
    },
  },

  // ── MAIN CARD ────────────────────────────────────────────────────────────────
  shahbazyan: {
    id: "shahbazyan",
    name: "Edmen Shahbazyan",
    firstName: "Edmen",
    lastName: "Shahbazyan",
    nickname: "The Golden Boy",
    weightClass: "Middleweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-09/SHAHBAZYAN_EDMEN_L_09-27.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-12/SHAHBAZYAN_EDMEN_L_12-14.png",
    ],
    stats: {
      age: 27, height: "6'1\"", weight: "185 lbs", reach: "75\"",
      stance: "Orthodox", country: "USA", gym: "Team Shahbazyan",
      wins: 12, losses: 4, draws: 0,
      sigStrikesLanded: 5.32, sigStrikesAbsorbed: 3.71,
      sigStrikeAccuracy: 56, sigStrikeDefense: 58,
      knockdownAvg: 0.82,
      takedownAvg: 0.55, takedownAccuracy: 50, takedownDefense: 80, submissionAvg: 0.6,
      koTkoWins: 7, submissionWins: 3, ufcKoLosses: 1, careerKoLosses: 1, knockdownsAbsorbed: 2,
      winsAsFavorite: 8, lossesAsFavorite: 1, winsAsUnderdog: 1, lossesAsUnderdog: 3,
      lastFights: [
        { opponent: "Chris Curtis",    result: "W", method: "KO (Punches)",    event: "UFC Fight Night", round: 1, date: "Sep 27, 2025" },
        { opponent: "Gregory Rodrigues",result:"W", method: "KO (Punches)",   event: "UFC Fight Night", round: 2, date: "Dec 14, 2024" },
        { opponent: "Chidi Njokuani",  result: "W", method: "TKO (Punches)",  event: "UFC Fight Night", round: 1, date: "Jun 1, 2024" },
        { opponent: "Bruno Silva",     result: "L", method: "KO (Punches)",   event: "UFC Fight Night", round: 3, date: "Feb 3, 2024" },
        { opponent: "Nassourdine Imavov",result:"L",method: "DEC (Unanimous)",event: "UFC Fight Night", round: 3, date: "Sep 16, 2023" },
      ],
    },
  },

  park: {
    id: "park",
    name: "JunYong Park",
    firstName: "JunYong",
    lastName: "Park",
    nickname: "The Iron Turtle",
    weightClass: "Middleweight",
    nationality: "🇰🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-04/PARK_JUNYONG_L_04-05.png",
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-06/PARK_JUNYONG_L_06-01.png",
    ],
    stats: {
      age: 34, height: "6'0\"", weight: "185 lbs", reach: "72\"",
      stance: "Orthodox", country: "South Korea", gym: "MMA Corea",
      wins: 16, losses: 6, draws: 0,
      sigStrikesLanded: 3.85, sigStrikesAbsorbed: 3.42,
      sigStrikeAccuracy: 45, sigStrikeDefense: 60,
      knockdownAvg: 0.22,
      takedownAvg: 2.80, takedownAccuracy: 46, takedownDefense: 72, submissionAvg: 0.8,
      koTkoWins: 4, submissionWins: 6, ufcKoLosses: 1, careerKoLosses: 2, knockdownsAbsorbed: 1,
      winsAsFavorite: 8, lossesAsFavorite: 2, winsAsUnderdog: 5, lossesAsUnderdog: 4,
      lastFights: [
        { opponent: "Cesar Almeida",   result: "L", method: "TKO (Punches)",  event: "UFC Fight Night", round: 1, date: "Apr 5, 2025" },
        { opponent: "Philip Rowe",     result: "W", method: "DEC (Unanimous)",event: "UFC Fight Night", round: 3, date: "Jun 1, 2024" },
        { opponent: "Andreas Michailidis",result:"W",method:"DEC (Unanimous)",event: "UFC Fight Night", round: 3, date: "Oct 14, 2023" },
        { opponent: "Eryk Anders",     result: "W", method: "SUB (Guillotine)",event:"UFC Fight Night", round: 2, date: "Jun 10, 2023" },
        { opponent: "AJ Dobson",       result: "W", method: "DEC (Unanimous)",event: "UFC Fight Night", round: 3, date: "Dec 3, 2022" },
      ],
    },
  },

  // ── PRELIMS ──────────────────────────────────────────────────────────────────
  vannata: {
    id: "vannata",
    name: "Lando Vannata",
    firstName: "Lando",
    lastName: "Vannata",
    nickname: "Groovy",
    weightClass: "Lightweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2023-04/VANNATA_LANDO_L_04-15.png",
    ],
    stats: {
      age: 33, height: "5'8\"", weight: "155 lbs", reach: "69\"",
      stance: "Orthodox", country: "USA", gym: "Team Elevation",
      wins: 12, losses: 7, draws: 2,
      sigStrikesLanded: 5.88, sigStrikesAbsorbed: 5.62,
      sigStrikeAccuracy: 47, sigStrikeDefense: 48,
      knockdownAvg: 0.55,
      takedownAvg: 0.82, takedownAccuracy: 38, takedownDefense: 58, submissionAvg: 0.9,
      koTkoWins: 5, submissionWins: 4, ufcKoLosses: 2, careerKoLosses: 3, knockdownsAbsorbed: 3,
      winsAsFavorite: 3, lossesAsFavorite: 2, winsAsUnderdog: 5, lossesAsUnderdog: 5,
      lastFights: [
        { opponent: "Daniel Zellhuber", result: "L", method: "DEC (Unanimous)",event: "UFC Fight Night", round: 3, date: "Apr 15, 2023" },
        { opponent: "Charles Jourdain", result: "W", method: "TKO (Punches)",  event: "UFC Fight Night", round: 1, date: "Feb 25, 2023" },
        { opponent: "Shane Burgos",     result: "L", method: "TKO (Punches)",  event: "UFC Fight Night", round: 3, date: "May 14, 2022" },
        { opponent: "David Zawada",     result: "W", method: "KO (Head Kick)", event: "UFC Fight Night", round: 1, date: "Sep 25, 2021" },
        { opponent: "Yancy Medeiros",   result: "W", method: "KO (Punches)",   event: "UFC Fight Night", round: 1, date: "Apr 10, 2021" },
      ],
    },
  },

  flowers: {
    id: "flowers",
    name: "Darrius Flowers",
    firstName: "Darrius",
    lastName: "Flowers",
    nickname: "Beast Mode",
    weightClass: "Lightweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-07/FLOWERS_DARRIUS_L_07-13.png",
    ],
    stats: {
      age: 33, height: "5'10\"", weight: "155 lbs", reach: "73\"",
      stance: "Southpaw", country: "USA", gym: "Roufusport",
      wins: 12, losses: 8, draws: 1,
      sigStrikesLanded: 3.72, sigStrikesAbsorbed: 4.18,
      sigStrikeAccuracy: 39, sigStrikeDefense: 52,
      knockdownAvg: 0.28,
      takedownAvg: 1.10, takedownAccuracy: 40, takedownDefense: 61, submissionAvg: 0.5,
      koTkoWins: 4, submissionWins: 3, ufcKoLosses: 0, careerKoLosses: 1, knockdownsAbsorbed: 2,
      winsAsFavorite: 4, lossesAsFavorite: 3, winsAsUnderdog: 4, lossesAsUnderdog: 5,
      lastFights: [
        { opponent: "Evan Elder",       result: "L", method: "SUB (Arm Triangle)",event: "UFC Fight Night", round: 2, date: "Jul 13, 2024" },
        { opponent: "Michael Johnson",  result: "L", method: "DEC (Unanimous)",   event: "UFC Fight Night", round: 3, date: "Feb 3, 2024" },
        { opponent: "Ignacio Bahamondes",result:"L", method: "DEC (Unanimous)",   event: "UFC Fight Night", round: 3, date: "Sep 9, 2023" },
        { opponent: "Christos Giagos",  result: "W", method: "DEC (Unanimous)",   event: "UFC Fight Night", round: 3, date: "Aug 6, 2022" },
        { opponent: "Roosevelt Roberts",result: "W", method: "KO (Punches)",      event: "UFC Fight Night", round: 1, date: "May 21, 2022" },
      ],
    },
  },

  cowan: {
    id: "cowan",
    name: "Hailey Cowan",
    firstName: "Hailey",
    lastName: "Cowan",
    weightClass: "Women's Bantamweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-03/COWAN_HAILEY_L_03-22.png",
    ],
    stats: {
      age: 29, height: "5'8\"", weight: "135 lbs", reach: "68\"",
      stance: "Orthodox", country: "USA", gym: "Elevation Fight Team",
      wins: 8, losses: 3, draws: 0,
      sigStrikesLanded: 4.45, sigStrikesAbsorbed: 3.92,
      sigStrikeAccuracy: 46, sigStrikeDefense: 56,
      knockdownAvg: 0.35,
      takedownAvg: 1.20, takedownAccuracy: 42, takedownDefense: 65, submissionAvg: 0.5,
      koTkoWins: 3, submissionWins: 2, ufcKoLosses: 1, careerKoLosses: 1, knockdownsAbsorbed: 1,
      winsAsFavorite: 4, lossesAsFavorite: 1, winsAsUnderdog: 2, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Macy Chiasson",   result: "W", method: "TKO (Punches)",  event: "UFC Fight Night", round: 2, date: "Nov 16, 2024" },
        { opponent: "Pannie Kianzad",  result: "W", method: "DEC (Unanimous)",event: "UFC Fight Night", round: 3, date: "Jun 22, 2024" },
        { opponent: "Ketlen Vieira",   result: "L", method: "DEC (Unanimous)",event: "UFC Fight Night", round: 3, date: "Feb 3, 2024" },
        { opponent: "Sara McMann",     result: "W", method: "TKO (Punches)",  event: "UFC Fight Night", round: 1, date: "Oct 21, 2023" },
        { opponent: "Tamires Vidal",   result: "W", method: "DEC (Split)",    event: "UFC Fight Night", round: 3, date: "Jul 1, 2023" },
      ],
    },
  },

  pereira_alice: {
    id: "pereira_alice",
    name: "Alice Pereira",
    firstName: "Alice",
    lastName: "Pereira",
    weightClass: "Women's Bantamweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-11/PEREIRA_ALICE_L_11-01.png",
    ],
    stats: {
      age: 30, height: "5'6\"", weight: "135 lbs", reach: "65\"",
      stance: "Orthodox", country: "Brazil", gym: "Chute Boxe",
      wins: 9, losses: 3, draws: 0,
      sigStrikesLanded: 3.80, sigStrikesAbsorbed: 3.45,
      sigStrikeAccuracy: 41, sigStrikeDefense: 57,
      knockdownAvg: 0.20,
      takedownAvg: 2.10, takedownAccuracy: 46, takedownDefense: 60, submissionAvg: 1.2,
      koTkoWins: 2, submissionWins: 4, ufcKoLosses: 1, careerKoLosses: 1, knockdownsAbsorbed: 1,
      winsAsFavorite: 3, lossesAsFavorite: 1, winsAsUnderdog: 4, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Talia Santos",    result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Nov 1, 2025" },
        { opponent: "Nadia Kassem",    result: "W", method: "SUB (RNC)",       event: "UFC Fight Night", round: 2, date: "Jun 7, 2025" },
        { opponent: "Julija Stoliarenko",result:"L",method: "SUB (Armbar)",    event: "UFC Fight Night", round: 1, date: "Nov 16, 2024" },
        { opponent: "Vanessa Demopoulos",result:"W",method:"TKO (Punches)",   event: "UFC Fight Night", round: 2, date: "Jul 27, 2024" },
        { opponent: "Shanna Young",    result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Mar 16, 2024" },
      ],
    },
  },

  // ── MAIN CARD continued ───────────────────────────────────────────────────
  yakhyaev: {
    id: "yakhyaev",
    name: "Abdul-Rakhman Yakhyaev",
    firstName: "Abdul-Rakhman",
    lastName: "Yakhyaev",
    nickname: "Hunter",
    weightClass: "Light Heavyweight",
    nationality: "🇷🇺",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-11/YAKHYAEV_ABDULRAKHMAN_L_11-01.png",
    ],
    stats: {
      age: 25, height: "6'2\"", weight: "205 lbs", reach: "78\"",
      stance: "Orthodox", country: "Russia", gym: "Tiger Muay Thai",
      wins: 8, losses: 0, draws: 0,
      sigStrikesLanded: 6.20, sigStrikesAbsorbed: 2.10,
      sigStrikeAccuracy: 58, sigStrikeDefense: 70,
      knockdownAvg: 1.20,
      takedownAvg: 1.50, takedownAccuracy: 55, takedownDefense: 85, submissionAvg: 1.8,
      koTkoWins: 5, submissionWins: 2, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 5, lossesAsFavorite: 0, winsAsUnderdog: 1, lossesAsUnderdog: 0,
      lastFights: [
        { opponent: "Brendson Ribeiro", result: "W", method: "SUB (RNC)",      event: "UFC Fight Night", round: 1, date: "Nov 1, 2025" },
        { opponent: "Debutant",         result: "W", method: "TKO (Punches)",  event: "DWCS",            round: 1, date: "Aug 6, 2024" },
        { opponent: "Opponent",         result: "W", method: "TKO (Punches)",  event: "Regional",        round: 1, date: "2023" },
        { opponent: "Opponent",         result: "W", method: "SUB (Guillotine)",event: "Regional",       round: 1, date: "2023" },
        { opponent: "Opponent",         result: "W", method: "TKO",            event: "Regional",        round: 1, date: "2022" },
      ],
    },
  },

  ribeiro: {
    id: "ribeiro",
    name: "Brendson Ribeiro",
    firstName: "Brendson",
    lastName: "Ribeiro",
    nickname: "Marreta",
    weightClass: "Light Heavyweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-09/RIBEIRO_BRENDSON_L_09-21.png",
    ],
    stats: {
      age: 32, height: "6'3\"", weight: "205 lbs", reach: "81\"",
      stance: "Orthodox", country: "Brazil", gym: "American Top Team",
      wins: 12, losses: 4, draws: 0,
      sigStrikesLanded: 3.80, sigStrikesAbsorbed: 4.50,
      sigStrikeAccuracy: 44, sigStrikeDefense: 52,
      knockdownAvg: 0.30,
      takedownAvg: 1.20, takedownAccuracy: 40, takedownDefense: 55, submissionAvg: 1.2,
      koTkoWins: 4, submissionWins: 5, ufcKoLosses: 1, careerKoLosses: 1, knockdownsAbsorbed: 1,
      winsAsFavorite: 5, lossesAsFavorite: 1, winsAsUnderdog: 3, lossesAsUnderdog: 3,
      lastFights: [
        { opponent: "Abdul-Rakhman Yakhyaev", result: "L", method: "SUB (RNC)",       event: "UFC Fight Night", round: 1, date: "Nov 1, 2025" },
        { opponent: "Alonzo Menifield",       result: "L", method: "TKO (Punches)",   event: "UFC Fight Night", round: 1, date: "Mar 1, 2025" },
        { opponent: "Da-un Jung",             result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Sep 21, 2024" },
        { opponent: "Khalil Rountree",        result: "L", method: "TKO (Punches)",   event: "UFC Fight Night", round: 2, date: "Feb 17, 2024" },
        { opponent: "Marcin Prachnio",        result: "W", method: "SUB (Guillotine)",event: "UFC Fight Night", round: 2, date: "Jun 24, 2023" },
      ],
    },
  },

  ewing: {
    id: "ewing",
    name: "Ethyn Ewing",
    firstName: "Ethyn",
    lastName: "Ewing",
    nickname: "The Professor Finesser",
    weightClass: "Bantamweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-11/EWING_ETHYN_L_11-01.png",
    ],
    stats: {
      age: 27, height: "5'9\"", weight: "135 lbs", reach: "72\"",
      stance: "Orthodox", country: "USA", gym: "KnockOut Fitness",
      wins: 9, losses: 2, draws: 0,
      sigStrikesLanded: 5.67, sigStrikesAbsorbed: 4.10,
      sigStrikeAccuracy: 52, sigStrikeDefense: 58,
      knockdownAvg: 0.40,
      takedownAvg: 3.00, takedownAccuracy: 60, takedownDefense: 100, submissionAvg: 0.8,
      koTkoWins: 3, submissionWins: 3, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 3, lossesAsFavorite: 0, winsAsUnderdog: 3, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Malcolm Wellmaker", result: "W", method: "DEC (Unanimous)", event: "UFC 322",       round: 3, date: "Nov 1, 2025" },
        { opponent: "Daniel da Silva",   result: "W", method: "TKO (Punches)",   event: "DWCS",          round: 2, date: "Sep 10, 2024" },
        { opponent: "Opponent",          result: "W", method: "SUB",             event: "Regional",      round: 1, date: "2024" },
        { opponent: "Opponent",          result: "L", method: "DEC",             event: "Regional",      round: 3, date: "2023" },
        { opponent: "Opponent",          result: "W", method: "TKO",             event: "Regional",      round: 1, date: "2023" },
      ],
    },
  },

  estevam: {
    id: "estevam",
    name: "Rafael Estevam",
    firstName: "Rafael",
    lastName: "Estevam",
    nickname: "Macapá",
    weightClass: "Bantamweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-08/ESTEVAM_RAFAEL_L_08-30.png",
    ],
    stats: {
      age: 26, height: "5'6\"", weight: "135 lbs", reach: "68\"",
      stance: "Orthodox", country: "Brazil", gym: "BJJR Team",
      wins: 17, losses: 1, draws: 0,
      sigStrikesLanded: 4.20, sigStrikesAbsorbed: 2.59,
      sigStrikeAccuracy: 54, sigStrikeDefense: 65,
      knockdownAvg: 0.25,
      takedownAvg: 6.01, takedownAccuracy: 62, takedownDefense: 70, submissionAvg: 2.5,
      koTkoWins: 2, submissionWins: 10, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 7, lossesAsFavorite: 0, winsAsUnderdog: 3, lossesAsUnderdog: 1,
      lastFights: [
        { opponent: "Jose Johnson",     result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Aug 30, 2025" },
        { opponent: "Tatsuro Taira",    result: "L", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Apr 5, 2025" },
        { opponent: "Carlos Candelario",result: "W", method: "SUB (Guillotine)",event: "UFC Fight Night", round: 1, date: "Nov 2, 2024" },
        { opponent: "Joshua Van",       result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Jun 29, 2024" },
        { opponent: "Daniel da Silva",  result: "W", method: "SUB (RNC)",       event: "DWCS",            round: 2, date: "Sep 19, 2023" },
      ],
    },
  },

  mcmillen: {
    id: "mcmillen",
    name: "Tommy McMillen",
    firstName: "Tommy",
    lastName: "McMillen",
    weightClass: "Featherweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-09/MCMILLEN_TOMMY_L_09-30.png",
    ],
    stats: {
      age: 28, height: "5'9\"", weight: "145 lbs", reach: "71\"",
      stance: "Orthodox", country: "USA", gym: "MMA Lab",
      wins: 9, losses: 0, draws: 0,
      sigStrikesLanded: 7.53, sigStrikesAbsorbed: 5.67,
      sigStrikeAccuracy: 51, sigStrikeDefense: 50,
      knockdownAvg: 0.60,
      takedownAvg: 1.20, takedownAccuracy: 44, takedownDefense: 70, submissionAvg: 0.5,
      koTkoWins: 5, submissionWins: 3, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 5, lossesAsFavorite: 0, winsAsUnderdog: 1, lossesAsUnderdog: 0,
      lastFights: [
        { opponent: "Contender Series",result: "W", method: "TKO (Punches)",   event: "DWCS",      round: 1, date: "Sep 30, 2025" },
        { opponent: "Regional",        result: "W", method: "KO",              event: "Regional",  round: 1, date: "2025" },
        { opponent: "Regional",        result: "W", method: "TKO",             event: "Regional",  round: 2, date: "2024" },
        { opponent: "Regional",        result: "W", method: "SUB",             event: "Regional",  round: 1, date: "2024" },
        { opponent: "Regional",        result: "W", method: "DEC",             event: "Regional",  round: 3, date: "2023" },
      ],
    },
  },

  zecchini: {
    id: "zecchini",
    name: "Manolo Zecchini",
    firstName: "Manolo",
    lastName: "Zecchini",
    weightClass: "Featherweight",
    nationality: "🇮🇹",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2023-09/ZECCHINI_MANOLO_L_09-02.png",
    ],
    stats: {
      age: 35, height: "5'9\"", weight: "145 lbs", reach: "70\"",
      stance: "Orthodox", country: "Italy", gym: "Akhmat Fight Club",
      wins: 11, losses: 4, draws: 0,
      sigStrikesLanded: 3.20, sigStrikesAbsorbed: 4.80,
      sigStrikeAccuracy: 38, sigStrikeDefense: 48,
      knockdownAvg: 0.15,
      takedownAvg: 1.80, takedownAccuracy: 42, takedownDefense: 55, submissionAvg: 1.0,
      koTkoWins: 4, submissionWins: 4, ufcKoLosses: 1, careerKoLosses: 2, knockdownsAbsorbed: 2,
      winsAsFavorite: 4, lossesAsFavorite: 2, winsAsUnderdog: 5, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Shayilan Nuerdanbieke",result:"L",method:"KO (Punches)",  event: "UFC Fight Night", round: 1, date: "Sep 2, 2023" },
        { opponent: "Kamuela Kirk",        result: "W", method: "DEC (Unanimous)",event:"UFC Fight Night",round: 3, date: "May 13, 2023" },
        { opponent: "Douglas Silva",       result: "W", method: "SUB (Guillotine)",event:"UFC Fight Night",round: 1, date: "Sep 10, 2022" },
        { opponent: "Ricardo Ramos",       result: "L", method: "TKO (Punches)", event: "UFC Fight Night", round: 2, date: "Apr 9, 2022" },
        { opponent: "Joanderson Brito",    result: "L", method: "DEC (Unanimous)",event:"UFC Fight Night", round: 3, date: "Oct 30, 2021" },
      ],
    },
  },

  // ── PRELIMS ──────────────────────────────────────────────────────────────────
  delano: {
    id: "delano",
    name: "Jose Mauro Delano",
    firstName: "Jose Mauro",
    lastName: "Delano",
    weightClass: "Featherweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-03/DELANO_JOSEMAURO_L_03-21.png",
    ],
    stats: {
      age: 30, height: "5'9\"", weight: "145 lbs", reach: "72\"",
      stance: "Orthodox", country: "Brazil", gym: "Chute Boxe",
      wins: 13, losses: 2, draws: 0,
      sigStrikesLanded: 4.50, sigStrikesAbsorbed: 3.20,
      sigStrikeAccuracy: 48, sigStrikeDefense: 60,
      knockdownAvg: 0.40,
      takedownAvg: 1.50, takedownAccuracy: 45, takedownDefense: 68, submissionAvg: 0.8,
      koTkoWins: 6, submissionWins: 4, ufcKoLosses: 0, careerKoLosses: 1, knockdownsAbsorbed: 0,
      winsAsFavorite: 6, lossesAsFavorite: 1, winsAsUnderdog: 4, lossesAsUnderdog: 1,
      lastFights: [
        { opponent: "Regional",  result: "W", method: "KO",  event: "Regional", round: 1, date: "2025" },
        { opponent: "Regional",  result: "W", method: "TKO", event: "Regional", round: 1, date: "2025" },
        { opponent: "Regional",  result: "W", method: "DEC", event: "Regional", round: 3, date: "2024" },
        { opponent: "Regional",  result: "W", method: "KO",  event: "Regional", round: 2, date: "2024" },
        { opponent: "Regional",  result: "L", method: "DEC", event: "Regional", round: 3, date: "2023" },
      ],
    },
  },

  ruchala: {
    id: "ruchala",
    name: "Robert Ruchała",
    firstName: "Robert",
    lastName: "Ruchała",
    weightClass: "Featherweight",
    nationality: "🇵🇱",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-10/RUCHALA_ROBERT_L_10-25.png",
    ],
    stats: {
      age: 28, height: "5'9\"", weight: "145 lbs", reach: "70\"",
      stance: "Southpaw", country: "Poland", gym: "KSW",
      wins: 17, losses: 3, draws: 0,
      sigStrikesLanded: 3.90, sigStrikesAbsorbed: 3.50,
      sigStrikeAccuracy: 46, sigStrikeDefense: 58,
      knockdownAvg: 0.30,
      takedownAvg: 2.00, takedownAccuracy: 48, takedownDefense: 65, submissionAvg: 0.9,
      koTkoWins: 5, submissionWins: 8, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 8, lossesAsFavorite: 1, winsAsUnderdog: 5, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Regional",  result: "W", method: "SUB", event: "KSW",     round: 2, date: "2025" },
        { opponent: "Regional",  result: "W", method: "KO",  event: "KSW",     round: 1, date: "2024" },
        { opponent: "Regional",  result: "W", method: "DEC", event: "KSW",     round: 3, date: "2024" },
        { opponent: "Regional",  result: "L", method: "DEC", event: "KSW",     round: 3, date: "2023" },
        { opponent: "Regional",  result: "W", method: "SUB", event: "Regional",round: 1, date: "2023" },
      ],
    },
  },

  pat: {
    id: "pat",
    name: "Guilherme Pat",
    firstName: "Guilherme",
    lastName: "Pat",
    weightClass: "Heavyweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-10/PAT_GUILHERME_L_10-25.png",
    ],
    stats: {
      age: 31, height: "6'2\"", weight: "265 lbs", reach: "76\"",
      stance: "Orthodox", country: "Brazil", gym: "Chute Boxe",
      wins: 6, losses: 0, draws: 0,
      sigStrikesLanded: 5.10, sigStrikesAbsorbed: 3.20,
      sigStrikeAccuracy: 52, sigStrikeDefense: 62,
      knockdownAvg: 0.70,
      takedownAvg: 1.00, takedownAccuracy: 45, takedownDefense: 75, submissionAvg: 0.5,
      koTkoWins: 4, submissionWins: 1, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 3, lossesAsFavorite: 0, winsAsUnderdog: 2, lossesAsUnderdog: 0,
      lastFights: [
        { opponent: "UFC debut opponent", result: "W", method: "TKO (Punches)", event: "UFC Fight Night", round: 1, date: "Oct 25, 2025" },
        { opponent: "Regional",           result: "W", method: "KO",           event: "Regional",        round: 1, date: "2025" },
        { opponent: "Regional",           result: "W", method: "TKO",          event: "Regional",        round: 2, date: "2024" },
        { opponent: "Regional",           result: "W", method: "KO",           event: "Regional",        round: 1, date: "2024" },
        { opponent: "Regional",           result: "W", method: "SUB",          event: "Regional",        round: 1, date: "2023" },
      ],
    },
  },

  petersen: {
    id: "petersen",
    name: "Thomas Petersen",
    firstName: "Thomas",
    lastName: "Petersen",
    weightClass: "Heavyweight",
    nationality: "🇩🇰",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-07/PETERSEN_THOMAS_L_07-13.png",
    ],
    stats: {
      age: 33, height: "6'5\"", weight: "265 lbs", reach: "82\"",
      stance: "Orthodox", country: "Denmark", gym: "SBG Denmark",
      wins: 11, losses: 4, draws: 0,
      sigStrikesLanded: 3.80, sigStrikesAbsorbed: 5.10,
      sigStrikeAccuracy: 44, sigStrikeDefense: 44,
      knockdownAvg: 0.30,
      takedownAvg: 0.80, takedownAccuracy: 38, takedownDefense: 50, submissionAvg: 0.4,
      koTkoWins: 6, submissionWins: 3, ufcKoLosses: 2, careerKoLosses: 2, knockdownsAbsorbed: 3,
      winsAsFavorite: 4, lossesAsFavorite: 2, winsAsUnderdog: 4, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Shamil Gaziev",  result: "L", method: "KO (Punches)",  event: "UFC Fight Night", round: 1, date: "Jul 13, 2024" },
        { opponent: "Vitor Petrino",  result: "L", method: "TKO (Punches)", event: "UFC Fight Night", round: 3, date: "Mar 23, 2024" },
        { opponent: "Andrei Arlovski",result: "W", method: "DEC (Unanimous)",event:"UFC Fight Night", round: 3, date: "Sep 9, 2023" },
        { opponent: "Jared Vanderaa", result: "W", method: "DEC (Unanimous)",event:"UFC Fight Night", round: 3, date: "Mar 4, 2023" },
        { opponent: "Alexandr Romanov",result:"L", method: "SUB (RNC)",     event: "UFC Fight Night", round: 1, date: "Sep 3, 2022" },
      ],
    },
  },

  costa_ale: {
    id: "costa_ale",
    name: "Alessandro Costa",
    firstName: "Alessandro",
    lastName: "Costa",
    weightClass: "Flyweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-12/COSTA_ALESSANDRO_L_12-06.png",
    ],
    stats: {
      age: 29, height: "5'6\"", weight: "125 lbs", reach: "67\"",
      stance: "Orthodox", country: "Brazil", gym: "Team Nogueira",
      wins: 14, losses: 3, draws: 0,
      sigStrikesLanded: 4.20, sigStrikesAbsorbed: 3.80,
      sigStrikeAccuracy: 46, sigStrikeDefense: 58,
      knockdownAvg: 0.25,
      takedownAvg: 2.50, takedownAccuracy: 50, takedownDefense: 65, submissionAvg: 1.5,
      koTkoWins: 3, submissionWins: 6, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 6, lossesAsFavorite: 1, winsAsUnderdog: 5, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "UFC debut",    result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Dec 6, 2025" },
        { opponent: "Regional",     result: "W", method: "SUB",             event: "Regional",        round: 2, date: "2025" },
        { opponent: "Regional",     result: "W", method: "KO",              event: "Regional",        round: 1, date: "2024" },
        { opponent: "Regional",     result: "W", method: "DEC",             event: "Regional",        round: 3, date: "2024" },
        { opponent: "Regional",     result: "L", method: "DEC",             event: "Regional",        round: 3, date: "2023" },
      ],
    },
  },

  nicoll: {
    id: "nicoll",
    name: "Stewart Nicoll",
    firstName: "Stewart",
    lastName: "Nicoll",
    weightClass: "Flyweight",
    nationality: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-09/NICOLL_STEWART_L_09-20.png",
    ],
    stats: {
      age: 28, height: "5'5\"", weight: "125 lbs", reach: "66\"",
      stance: "Orthodox", country: "Scotland", gym: "SBG Scotland",
      wins: 10, losses: 2, draws: 0,
      sigStrikesLanded: 3.80, sigStrikesAbsorbed: 3.20,
      sigStrikeAccuracy: 44, sigStrikeDefense: 60,
      knockdownAvg: 0.20,
      takedownAvg: 3.00, takedownAccuracy: 55, takedownDefense: 70, submissionAvg: 1.8,
      koTkoWins: 2, submissionWins: 5, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 4, lossesAsFavorite: 1, winsAsUnderdog: 4, lossesAsUnderdog: 1,
      lastFights: [
        { opponent: "UFC debut",  result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Sep 20, 2025" },
        { opponent: "Regional",   result: "W", method: "SUB",             event: "Regional",        round: 2, date: "2025" },
        { opponent: "Regional",   result: "W", method: "DEC",             event: "Regional",        round: 3, date: "2024" },
        { opponent: "Regional",   result: "L", method: "DEC",             event: "Regional",        round: 3, date: "2023" },
        { opponent: "Regional",   result: "W", method: "SUB",             event: "Regional",        round: 1, date: "2023" },
      ],
    },
  },

  bekoev: {
    id: "bekoev",
    name: "Azamat Bekoev",
    firstName: "Azamat",
    lastName: "Bekoev",
    weightClass: "Middleweight",
    nationality: "🇷🇺",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-06/BEKOEV_AZAMAT_L_06-28.png",
    ],
    stats: {
      age: 27, height: "6'1\"", weight: "185 lbs", reach: "76\"",
      stance: "Orthodox", country: "Russia", gym: "Akhmat Fight Club",
      wins: 9, losses: 1, draws: 0,
      sigStrikesLanded: 5.50, sigStrikesAbsorbed: 3.10,
      sigStrikeAccuracy: 55, sigStrikeDefense: 65,
      knockdownAvg: 0.80,
      takedownAvg: 2.00, takedownAccuracy: 52, takedownDefense: 80, submissionAvg: 1.2,
      koTkoWins: 6, submissionWins: 2, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 5, lossesAsFavorite: 0, winsAsUnderdog: 2, lossesAsUnderdog: 1,
      lastFights: [
        { opponent: "UFC debut",   result: "W", method: "TKO (Punches)",  event: "UFC Fight Night", round: 1, date: "Jun 28, 2025" },
        { opponent: "Regional",    result: "W", method: "KO",             event: "Regional",        round: 1, date: "2025" },
        { opponent: "Regional",    result: "W", method: "TKO",            event: "Regional",        round: 2, date: "2024" },
        { opponent: "Regional",    result: "L", method: "DEC",            event: "Regional",        round: 3, date: "2024" },
        { opponent: "Regional",    result: "W", method: "KO",             event: "Regional",        round: 1, date: "2023" },
      ],
    },
  },

  gore: {
    id: "gore",
    name: "Tresean Gore",
    firstName: "Tresean",
    lastName: "Gore",
    weightClass: "Middleweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2022-11/GORE_TRESEAN_L_11-05.png",
    ],
    stats: {
      age: 28, height: "6'0\"", weight: "185 lbs", reach: "75\"",
      stance: "Orthodox", country: "USA", gym: "Sanford MMA",
      wins: 7, losses: 3, draws: 0,
      sigStrikesLanded: 3.50, sigStrikesAbsorbed: 3.80,
      sigStrikeAccuracy: 42, sigStrikeDefense: 55,
      knockdownAvg: 0.25,
      takedownAvg: 1.50, takedownAccuracy: 44, takedownDefense: 62, submissionAvg: 0.8,
      koTkoWins: 3, submissionWins: 3, ufcKoLosses: 1, careerKoLosses: 1, knockdownsAbsorbed: 1,
      winsAsFavorite: 3, lossesAsFavorite: 1, winsAsUnderdog: 2, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Denis Tiuliulin", result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Nov 5, 2022" },
        { opponent: "Carlos Ulberg",   result: "L", method: "KO (Punches)",    event: "UFC Fight Night", round: 2, date: "Feb 26, 2022" },
        { opponent: "Bryan Battle",    result: "L", method: "DEC (Unanimous)", event: "TUF 29 Finale",   round: 3, date: "Jul 4, 2021" },
        { opponent: "LaTravious Clardy",result:"W", method: "SUB (Guillotine)",event:"TUF 29",           round: 1, date: "2021" },
        { opponent: "Tresean Gomez",   result: "W", method: "KO",             event: "Regional",        round: 1, date: "2020" },
      ],
    },
  },

  barbosa: {
    id: "barbosa",
    name: "Dione Barbosa",
    firstName: "Dione",
    lastName: "Barbosa",
    weightClass: "Women's Flyweight",
    nationality: "🇧🇷",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-08/BARBOSA_DIONE_L_08-30.png",
    ],
    stats: {
      age: 30, height: "5'4\"", weight: "125 lbs", reach: "64\"",
      stance: "Orthodox", country: "Brazil", gym: "Brazilian Top Team",
      wins: 11, losses: 3, draws: 0,
      sigStrikesLanded: 4.00, sigStrikesAbsorbed: 3.60,
      sigStrikeAccuracy: 45, sigStrikeDefense: 56,
      knockdownAvg: 0.15,
      takedownAvg: 2.20, takedownAccuracy: 48, takedownDefense: 62, submissionAvg: 1.0,
      koTkoWins: 2, submissionWins: 5, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 5, lossesAsFavorite: 1, winsAsUnderdog: 4, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "UFC Fight",   result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Aug 30, 2025" },
        { opponent: "UFC Fight",   result: "W", method: "SUB",             event: "UFC Fight Night", round: 2, date: "Mar 2025" },
        { opponent: "UFC Fight",   result: "L", method: "DEC",             event: "UFC Fight Night", round: 3, date: "2024" },
        { opponent: "UFC Fight",   result: "W", method: "DEC",             event: "UFC Fight Night", round: 3, date: "2024" },
        { opponent: "UFC Fight",   result: "W", method: "TKO",             event: "UFC Fight Night", round: 2, date: "2023" },
      ],
    },
  },

  gatto: {
    id: "gatto",
    name: "Melissa Gatto",
    firstName: "Melissa",
    lastName: "Gatto",
    weightClass: "Women's Flyweight",
    nationality: "🇨🇦",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-05/GATTO_MELISSA_L_05-04.png",
    ],
    stats: {
      age: 32, height: "5'4\"", weight: "125 lbs", reach: "66\"",
      stance: "Orthodox", country: "Canada", gym: "Tristar Gym",
      wins: 9, losses: 3, draws: 1,
      sigStrikesLanded: 3.60, sigStrikesAbsorbed: 3.90,
      sigStrikeAccuracy: 43, sigStrikeDefense: 54,
      knockdownAvg: 0.10,
      takedownAvg: 1.80, takedownAccuracy: 44, takedownDefense: 60, submissionAvg: 0.9,
      koTkoWins: 2, submissionWins: 4, ufcKoLosses: 1, careerKoLosses: 1, knockdownsAbsorbed: 1,
      winsAsFavorite: 3, lossesAsFavorite: 1, winsAsUnderdog: 4, lossesAsUnderdog: 2,
      lastFights: [
        { opponent: "Karine Silva",    result: "L", method: "SUB (Armbar)",    event: "UFC Fight Night", round: 1, date: "May 4, 2024" },
        { opponent: "Lucie Pudilova",  result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Oct 14, 2023" },
        { opponent: "Jinh Yu Frey",    result: "NC", method: "NC",             event: "UFC Fight Night", round: 1, date: "Jun 17, 2023" },
        { opponent: "Jessica Andrade", result: "L", method: "TKO (Punches)",   event: "UFC Fight Night", round: 1, date: "Jan 14, 2023" },
        { opponent: "Priya Sharma",    result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Sep 3, 2022" },
      ],
    },
  },

  kamaka: {
    id: "kamaka",
    name: "Kai Kamaka III",
    firstName: "Kai",
    lastName: "Kamaka",
    nickname: "Young Savage",
    weightClass: "Lightweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2021-07/KAMAKA_KAI_L_07-10.png",
    ],
    stats: {
      age: 27, height: "5'10\"", weight: "155 lbs", reach: "72\"",
      stance: "Orthodox", country: "USA", gym: "Team Oyama",
      wins: 10, losses: 5, draws: 0,
      sigStrikesLanded: 4.20, sigStrikesAbsorbed: 4.50,
      sigStrikeAccuracy: 44, sigStrikeDefense: 50,
      knockdownAvg: 0.25,
      takedownAvg: 1.50, takedownAccuracy: 42, takedownDefense: 58, submissionAvg: 0.8,
      koTkoWins: 4, submissionWins: 4, ufcKoLosses: 1, careerKoLosses: 2, knockdownsAbsorbed: 2,
      winsAsFavorite: 3, lossesAsFavorite: 2, winsAsUnderdog: 5, lossesAsUnderdog: 3,
      lastFights: [
        { opponent: "Christos Giagos",  result: "W", method: "SUB (RNC)",      event: "UFC Fight Night",  round: 2, date: "Dec 3, 2022" },
        { opponent: "Ignacio Bahamondes",result:"L", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Jul 16, 2022" },
        { opponent: "Jordan Leavitt",   result: "L", method: "SUB (Guillotine)",event: "UFC Fight Night", round: 2, date: "Jan 15, 2022" },
        { opponent: "TJ Brown",         result: "L", method: "DEC (Split)",     event: "UFC Fight Night", round: 3, date: "Jun 26, 2021" },
        { opponent: "Jerome Rivera",    result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Mar 13, 2021" },
      ],
    },
  },

  hope: {
    id: "hope",
    name: "Dakota Hope",
    firstName: "Dakota",
    lastName: "Hope",
    weightClass: "Lightweight",
    nationality: "🇺🇸",
    imageUrls: [
      "https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-03/HOPE_DAKOTA_L_03-21.png",
    ],
    stats: {
      age: 26, height: "5'11\"", weight: "155 lbs", reach: "74\"",
      stance: "Orthodox", country: "USA", gym: "Xtreme Couture",
      wins: 8, losses: 2, draws: 0,
      sigStrikesLanded: 4.80, sigStrikesAbsorbed: 4.20,
      sigStrikeAccuracy: 47, sigStrikeDefense: 54,
      knockdownAvg: 0.35,
      takedownAvg: 1.80, takedownAccuracy: 46, takedownDefense: 65, submissionAvg: 0.6,
      koTkoWins: 4, submissionWins: 2, ufcKoLosses: 0, careerKoLosses: 0, knockdownsAbsorbed: 0,
      winsAsFavorite: 4, lossesAsFavorite: 1, winsAsUnderdog: 3, lossesAsUnderdog: 1,
      lastFights: [
        { opponent: "DWCS win",    result: "W", method: "TKO (Punches)",  event: "DWCS",      round: 1, date: "Mar 21, 2026" },
        { opponent: "Regional",    result: "W", method: "KO",             event: "Regional",  round: 1, date: "2025" },
        { opponent: "Regional",    result: "W", method: "DEC",            event: "Regional",  round: 3, date: "2025" },
        { opponent: "Regional",    result: "L", method: "DEC",            event: "Regional",  round: 3, date: "2024" },
        { opponent: "Regional",    result: "W", method: "TKO",            event: "Regional",  round: 2, date: "2024" },
      ],
    },
  },
};
