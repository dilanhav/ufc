export interface FightRecord {
  opponent: string;
  result: "W" | "L" | "NC";
  method: string;
  event: string;
  round: number;
  date: string;
}

export interface FighterStats {
  // Tale of the tape
  age: number;
  height: string;
  weight: string;
  reach: string;
  stance: string;
  country: string;
  gym: string;

  // Record
  wins: number;
  losses: number;
  draws: number;
  noContests: number;

  // Striking
  sigStrikesLanded: number;   // per min
  sigStrikesAbsorbed: number; // per min
  sigStrikeAccuracy: number;  // %
  sigStrikeDefense: number;   // %
  knockdownAvg: number;       // per 15 min

  // Grappling
  takedownAvg: number;        // per 15 min
  takedownAccuracy: number;   // %
  takedownDefense: number;    // %
  submissionAvg: number;      // per 15 min

  // Durability
  avgFightTime: string;       // mm:ss
  finishRate: number;         // % of wins by finish
  knockoutLosses: number;
  submissionLosses: number;

  // Computed advantages (0-10)
  boxing: number;
  kickboxing: number;
  grappling: number;
  bjj: number;
  durability: number;
  winRate: number;

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
  imageUrl?: string;
  nationality: string;
  stats: FighterStats;
}

export const FIGHTERS: Record<string, Fighter> = {
  moicano: {
    id: "moicano",
    name: "Renato Moicano",
    firstName: "Renato",
    lastName: "Moicano",
    nickname: "Money",
    ranking: 7,
    weightClass: "Lightweight",
    nationality: "🇧🇷",
    stats: {
      age: 32,
      height: "5'11\"",
      weight: "155 lbs",
      reach: "74\"",
      stance: "Orthodox",
      country: "Brazil",
      gym: "Team Alpha Male / Evolve MMA",

      wins: 21,
      losses: 5,
      draws: 1,
      noContests: 1,

      sigStrikesLanded: 5.42,
      sigStrikesAbsorbed: 3.81,
      sigStrikeAccuracy: 47,
      sigStrikeDefense: 60,
      knockdownAvg: 0.44,

      takedownAvg: 1.22,
      takedownAccuracy: 48,
      takedownDefense: 82,
      submissionAvg: 1.4,

      avgFightTime: "11:24",
      finishRate: 76,
      knockoutLosses: 1,
      submissionLosses: 2,

      boxing: 7.2,
      kickboxing: 6.8,
      grappling: 8.5,
      bjj: 9.1,
      durability: 7.0,
      winRate: 80.8,

      lastFights: [
        { opponent: "Islam Makhachev", result: "L", method: "SUB (RNC)", event: "UFC 311", round: 2, date: "Jan 18, 2025" },
        { opponent: "Arman Tsarukyan", result: "W", method: "KO (Punches)", event: "UFC 311", round: 2, date: "Jan 18, 2025" },
        { opponent: "Beneil Dariush", result: "W", method: "DEC (Unanimous)", event: "UFC 310", round: 3, date: "Dec 7, 2024" },
        { opponent: "Drew Dober", result: "W", method: "SUB (Guillotine)", event: "UFC Fight Night", round: 1, date: "Mar 9, 2024" },
        { opponent: "Brad Riddell", result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Sep 16, 2023" },
      ],
    },
  },

  duncan: {
    id: "duncan",
    name: "Michael Duncan",
    firstName: "Michael",
    lastName: "Duncan",
    nickname: "Maverick",
    ranking: undefined,
    weightClass: "Lightweight",
    nationality: "🇺🇸",
    stats: {
      age: 30,
      height: "6'1\"",
      weight: "155 lbs",
      reach: "75\"",
      stance: "Southpaw",
      country: "USA",
      gym: "American Top Team",

      wins: 12,
      losses: 3,
      draws: 0,
      noContests: 0,

      sigStrikesLanded: 4.88,
      sigStrikesAbsorbed: 4.12,
      sigStrikeAccuracy: 44,
      sigStrikeDefense: 55,
      knockdownAvg: 0.62,

      takedownAvg: 2.14,
      takedownAccuracy: 52,
      takedownDefense: 61,
      submissionAvg: 0.5,

      avgFightTime: "9:48",
      finishRate: 83,
      knockoutLosses: 2,
      submissionLosses: 0,

      boxing: 7.8,
      kickboxing: 7.5,
      grappling: 6.2,
      bjj: 5.4,
      durability: 6.1,
      winRate: 80.0,

      lastFights: [
        { opponent: "Ricky Glenn", result: "W", method: "TKO (Punches)", event: "UFC Fight Night", round: 2, date: "Nov 16, 2024" },
        { opponent: "Viacheslav Borshchev", result: "W", method: "KO (Head Kick)", event: "UFC 305", round: 1, date: "Aug 17, 2024" },
        { opponent: "Ignacio Bahamondes", result: "L", method: "DEC (Split)", event: "UFC Fight Night", round: 3, date: "Apr 6, 2024" },
        { opponent: "Marc Diakiese", result: "W", method: "TKO (Punches)", event: "UFC Fight Night", round: 1, date: "Nov 18, 2023" },
        { opponent: "Esteban Ribovics", result: "W", method: "DEC (Unanimous)", event: "UFC Fight Night", round: 3, date: "Aug 5, 2023" },
      ],
    },
  },
};
