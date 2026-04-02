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

  // Source: UFCStats / fight previews
  sigStrikesLanded: number;   // per min
  sigStrikesAbsorbed: number; // per min
  sigStrikeAccuracy: number;  // %
  sigStrikeDefense: number;   // %

  takedownAvg: number;        // per 15 min
  takedownAccuracy: number;   // %
  takedownDefense: number;    // %
  submissionAvg: number;      // per 15 min

  // Finish breakdown (for skill scoring)
  koTkoWins: number;          // UFC KO/TKO wins
  submissionWins: number;     // UFC submission wins
  ufcKoLosses: number;        // times stopped by strikes in UFC
  careerKoLosses: number;     // total career KO/TKO losses
  knockdownsAbsorbed: number; // UFC knockdowns absorbed

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
  // Multiple URL candidates tried in order; first to load wins
  imageUrls: string[];
  stats: FighterStats;
}

export const FIGHTERS: Record<string, Fighter> = {
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
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2025-06/MOICANO_RENATO_L_06282025.png",
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2025-01/MOICANO_RENATO_L_01182025.png",
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2024-09/MOICANO_RENATO_L_09282024.png",
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2024-04/MOICANO_RENATO_L_04132024.png",
    ],
    stats: {
      age: 36,
      height: "5'11\"",
      weight: "155 lbs",
      reach: "75\"",
      stance: "Orthodox",
      country: "Brazil",
      gym: "Evolve MMA",

      wins: 20,
      losses: 7,
      draws: 1,

      // Source: UFCStats via fight preview (Apr 2026)
      sigStrikesLanded: 4.17,
      sigStrikesAbsorbed: 3.57,
      sigStrikeAccuracy: 37,
      sigStrikeDefense: 59,
      takedownAvg: 1.67,
      takedownAccuracy: 44,
      takedownDefense: 62,
      submissionAvg: 1.4,

      koTkoWins: 2,          // Turner (UFC 300), Saint-Denis (UFC Paris)
      submissionWins: 6,     // UFC career
      ufcKoLosses: 3,        // Aldo, Korean Zombie, Kevin Holland
      careerKoLosses: 3,
      knockdownsAbsorbed: 1, // vs Jalin Turner (UFC 300), recovered to win

      lastFights: [
        { opponent: "Beneil Dariush",    result: "L", method: "DEC (Unanimous)",     event: "UFC 317",              round: 3, date: "Jun 28, 2025" },
        { opponent: "Islam Makhachev",   result: "L", method: "SUB (RNC)",           event: "UFC 311",              round: 1, date: "Jan 18, 2025" },
        { opponent: "Benoit Saint-Denis",result: "W", method: "TKO (Doctor Stop)",   event: "UFC Fight Night Paris", round: 2, date: "Sep 28, 2024" },
        { opponent: "Jalin Turner",      result: "W", method: "TKO (Ground & Pound).",event: "UFC 300",              round: 2, date: "Apr 13, 2024" },
        { opponent: "Drew Dober",        result: "W", method: "DEC (Unanimous)",     event: "UFC Fight Night",       round: 3, date: "Feb 3, 2024" },
      ],
    },
  },

  duncan: {
    id: "duncan",
    name: "Chris Duncan",
    firstName: "Chris",
    lastName: "Duncan",
    nickname: "The Problem",
    ranking: undefined,
    weightClass: "Lightweight",
    nationality: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    imageUrls: [
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2025-12/DUNCAN_CHRIS_L_12062025.png",
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2025-08/DUNCAN_CHRIS_L_08022025.png",
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2025-03/DUNCAN_CHRIS_L_03222025.png",
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2024-09/DUNCAN_CHRIS_L_09282024.png",
    ],
    stats: {
      age: 32,
      height: "5'10\"",
      weight: "155 lbs",
      reach: "72\"",
      stance: "Orthodox",
      country: "Scotland",
      gym: "American Top Team",

      wins: 15,
      losses: 2,
      draws: 0,

      // Source: UFCStats via fight preview (Apr 2026)
      sigStrikesLanded: 5.02,
      sigStrikesAbsorbed: 4.82,
      sigStrikeAccuracy: 43,
      sigStrikeDefense: 51,
      takedownAvg: 3.27,
      takedownAccuracy: 42,
      takedownDefense: 50,
      submissionAvg: 2.8,

      koTkoWins: 0,          // No UFC KO/TKO wins; Contender Series KO of Campbell doesn't count
      submissionWins: 8,     // Career: McKinney, Vucenic, Oki, + pre-UFC
      ufcKoLosses: 0,        // Never stopped by strikes in the UFC
      careerKoLosses: 1,     // Borshchev (Contender Series, stopped at 0:28 R2)
      knockdownsAbsorbed: 0, // No UFC knockdowns confirmed

      lastFights: [
        { opponent: "Terrance McKinney", result: "W", method: "SUB (Anaconda)",    event: "UFC 323",               round: 1, date: "Dec 6, 2025" },
        { opponent: "Jordan Vucenic",    result: "W", method: "SUB (Guillotine)",  event: "UFC Fight Night London", round: 2, date: "Mar 22, 2025" },
        { opponent: "Mateusz Rebecki",   result: "W", method: "DEC (Unanimous)",   event: "UFC on ESPN",            round: 3, date: "Aug 2, 2025" },
        { opponent: "Bolaji Oki",        result: "W", method: "SUB (Guillotine)",  event: "UFC Fight Night Paris",  round: 1, date: "Sep 28, 2024" },
        { opponent: "Manuel Torres",     result: "L", method: "SUB (RNC)",         event: "UFC Fight Night",        round: 1, date: "Feb 24, 2024" },
      ],
    },
  },
};

// ─── Derived skill scores ─────────────────────────────────────────────────────

export interface SkillScores {
  boxing: number;
  kickboxing: number;
  grappling: number;
  bjj: number;
  durability: number;
  standUpDefense: number; // 0-10
}

export function computeSkillScores(f: Fighter): SkillScores {
  const s = f.stats;

  // Boxing: KO wins, strike accuracy, volume, knockdown avg
  const boxing = clamp(
    4.0 +
      s.koTkoWins * 0.6 +
      (s.sigStrikeAccuracy > 45 ? 1.0 : s.sigStrikeAccuracy > 38 ? 0.5 : 0) +
      (s.sigStrikesLanded > 4.5 ? 1.0 : s.sigStrikesLanded > 3.5 ? 0.5 : 0),
    1, 10
  );

  // Kickboxing: striking volume, accuracy, defense, footwork proxy (volume + defense)
  const kickboxing = clamp(
    4.0 +
      s.koTkoWins * 0.4 +
      (s.sigStrikesLanded > 4.5 ? 1.2 : s.sigStrikesLanded > 3.5 ? 0.7 : 0) +
      (s.sigStrikeDefense > 60 ? 1.0 : s.sigStrikeDefense > 50 ? 0.5 : 0) +
      (s.sigStrikeAccuracy > 45 ? 0.5 : 0),
    1, 10
  );

  // Grappling: TD volume, accuracy, defense
  const grappling = clamp(
    4.0 +
      (s.takedownAvg > 3.0 ? 1.5 : s.takedownAvg > 2.0 ? 1.0 : s.takedownAvg > 1.0 ? 0.5 : 0) +
      (s.takedownAccuracy > 50 ? 1.0 : s.takedownAccuracy > 40 ? 0.5 : 0) +
      (s.takedownDefense > 70 ? 1.5 : s.takedownDefense > 55 ? 0.8 : 0),
    1, 10
  );

  // BJJ: submission wins, sub avg, belt level (encoded in submissionWins as proxy)
  const bjj = clamp(
    3.5 +
      s.submissionWins * 0.35 +
      (s.submissionAvg > 2.0 ? 1.5 : s.submissionAvg > 1.0 ? 0.8 : 0),
    1, 10
  );

  // Durability: UFC KO losses hurt the most, non-UFC less so, knockdowns and high absorption add risk
  const durability = clamp(
    8.5 -
      s.ufcKoLosses * 1.3 -
      (s.careerKoLosses - s.ufcKoLosses) * 0.4 -
      s.knockdownsAbsorbed * 0.3 -
      (s.sigStrikesAbsorbed > 4.5 ? 0.8 : s.sigStrikesAbsorbed > 3.5 ? 0.3 : 0),
    1, 10
  );

  // Stand-up defense: lower SApM = better, high strike defense %
  const standUpDefense = clamp(
    10 -
      (s.sigStrikesAbsorbed * 0.9) +
      ((s.sigStrikeDefense - 50) * 0.05),
    1, 10
  );

  return { boxing, kickboxing, grappling, bjj, durability, standUpDefense };
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(val * 10) / 10));
}

// ─── Recent form win probability ─────────────────────────────────────────────

export function computeRecentFormScore(fights: FightRecord[]): number {
  // Weighted: most recent fight has highest weight
  const last5 = fights.slice(0, 5);
  const weights = [5, 4, 3, 2, 1];
  let weightedWins = 0;
  let totalWeight = 0;
  last5.forEach((f, i) => {
    const w = weights[i] ?? 1;
    totalWeight += w;
    if (f.result === "W") weightedWins += w;
  });
  return totalWeight > 0 ? weightedWins / totalWeight : 0.5;
}

export function computeWinProbability(
  f1: Fighter,
  f2: Fighter
): { prob1: number; prob2: number } {
  const s1 = computeSkillScores(f1);
  const s2 = computeSkillScores(f2);

  const skillAvg1 =
    (s1.boxing + s1.kickboxing + s1.grappling + s1.bjj + s1.durability) / 5;
  const skillAvg2 =
    (s2.boxing + s2.kickboxing + s2.grappling + s2.bjj + s2.durability) / 5;

  const skillTotal = skillAvg1 + skillAvg2 || 1;
  const skillProb1 = skillAvg1 / skillTotal;
  const skillProb2 = skillAvg2 / skillTotal;

  const form1 = computeRecentFormScore(f1.stats.lastFights);
  const form2 = computeRecentFormScore(f2.stats.lastFights);
  const formTotal = form1 + form2 || 1;
  const formProb1 = form1 / formTotal;
  const formProb2 = form2 / formTotal;

  // 40% skill, 60% recent form
  const raw1 = skillProb1 * 0.4 + formProb1 * 0.6;
  const raw2 = skillProb2 * 0.4 + formProb2 * 0.6;
  const rawTotal = raw1 + raw2;

  return {
    prob1: Math.round((raw1 / rawTotal) * 1000) / 10,
    prob2: Math.round((raw2 / rawTotal) * 1000) / 10,
  };
}
