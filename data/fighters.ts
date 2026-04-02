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

  sigStrikesLanded: number;
  sigStrikesAbsorbed: number;
  sigStrikeAccuracy: number;
  sigStrikeDefense: number;

  takedownAvg: number;
  takedownAccuracy: number;
  takedownDefense: number;
  submissionAvg: number;

  avgFightTime: string;
  finishRate: number;

  // Skill scores (0–10), used to compute win probability
  boxing: number;
  kickboxing: number;
  grappling: number;
  bjj: number;
  durability: number;

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
  // Full-body cutout image from UFC CDN
  imageUrl?: string;
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
    imageUrl:
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2025-01/MOICANO_RENATO_L_01112025.png",
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

      // Source: UFCStats
      sigStrikesLanded: 2.14,
      sigStrikesAbsorbed: 2.42,
      sigStrikeAccuracy: 37,
      sigStrikeDefense: 63,

      takedownAvg: 2.98,
      takedownAccuracy: 44,
      takedownDefense: 73,
      submissionAvg: 1.4,

      avgFightTime: "8:22",
      finishRate: 70,

      // AI skill scores derived from career stats
      boxing: 6.5,
      kickboxing: 7.2,
      grappling: 7.8,
      bjj: 9.0,
      durability: 6.5,

      lastFights: [
        {
          opponent: "Beneil Dariush",
          result: "L",
          method: "DEC (Unanimous)",
          event: "UFC 317",
          round: 3,
          date: "Jun 28, 2025",
        },
        {
          opponent: "Islam Makhachev",
          result: "L",
          method: "SUB (RNC)",
          event: "UFC 311",
          round: 1,
          date: "Jan 18, 2025",
        },
        {
          opponent: "Benoit Saint-Denis",
          result: "W",
          method: "KO (Doctor Stoppage)",
          event: "UFC Fight Night Paris",
          round: 2,
          date: "Sep 28, 2024",
        },
        {
          opponent: "Jalin Turner",
          result: "W",
          method: "KO (Punches)",
          event: "UFC 300",
          round: 2,
          date: "Apr 13, 2024",
        },
        {
          opponent: "Drew Dober",
          result: "W",
          method: "DEC (Unanimous)",
          event: "UFC Fight Night",
          round: 3,
          date: "Feb 3, 2024",
        },
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
    imageUrl:
      "https://dmxg5wxfqgde4.cloudfront.net/styles/athlete_bio_full_body/s3/2025-03/DUNCAN_CHRIS_L_03222025.png",
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

      // Estimated from UFCStats patterns; exact figures unavailable via public scrape
      sigStrikesLanded: 3.62,
      sigStrikesAbsorbed: 3.95,
      sigStrikeAccuracy: 43,
      sigStrikeDefense: 53,

      takedownAvg: 2.10,
      takedownAccuracy: 48,
      takedownDefense: 58,
      submissionAvg: 2.8,

      avgFightTime: "7:05",
      finishRate: 87,

      // AI skill scores
      boxing: 6.8,
      kickboxing: 6.4,
      grappling: 7.2,
      bjj: 7.5,
      durability: 6.0,

      lastFights: [
        {
          opponent: "Terrance McKinney",
          result: "W",
          method: "SUB (Anaconda)",
          event: "UFC 323",
          round: 1,
          date: "Dec 6, 2025",
        },
        {
          opponent: "Jordan Vucenic",
          result: "W",
          method: "SUB (Guillotine)",
          event: "UFC Fight Night London",
          round: 2,
          date: "Mar 22, 2025",
        },
        {
          opponent: "Bolaji Oki",
          result: "W",
          method: "SUB (Guillotine)",
          event: "UFC Fight Night Paris",
          round: 1,
          date: "Sep 28, 2024",
        },
        {
          opponent: "Manuel Torres",
          result: "L",
          method: "SUB (RNC)",
          event: "UFC Fight Night",
          round: 1,
          date: "Feb 24, 2024",
        },
        {
          opponent: "Yanal Ashmouz",
          result: "W",
          method: "DEC (Unanimous)",
          event: "UFC Fight Night London",
          round: 3,
          date: "Jul 22, 2023",
        },
      ],
    },
  },
};
