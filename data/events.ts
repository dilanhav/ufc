export interface BettingOdds {
  fighter1American: number; // e.g. +145 or -175
  fighter2American: number;
  sportsbook: string;
}

export interface Fight {
  id: string;
  fighter1Id: string;
  fighter2Id: string;
  weightClass: string;
  isMainEvent: boolean;
  isCoMainEvent: boolean;
  isTitleFight: boolean;
  titleType?: "Undisputed" | "Interim";
  fighter1Ranking?: number;
  fighter2Ranking?: number;
  odds?: BettingOdds;
}

export interface FightNight {
  id: string;
  name: string;
  shortName: string;
  date: string;
  venue: string;
  location: string;
  broadcast: string;
  fights: Fight[];
}

export const EVENTS: FightNight[] = [
  {
    id: "ufc-fight-night-272",
    name: "UFC Fight Night: Moicano vs. Duncan",
    shortName: "Fight Night",
    date: "April 5, 2026",
    venue: "Meta APEX",
    location: "Las Vegas, NV",
    broadcast: "Paramount+",
    fights: [
      {
        id: "moicano-duncan",
        fighter1Id: "moicano",
        fighter2Id: "duncan",
        weightClass: "Lightweight",
        isMainEvent: true,
        isCoMainEvent: false,
        isTitleFight: false,
        fighter1Ranking: 10,
        fighter2Ranking: undefined,
        odds: {
          fighter1American: +145,  // Moicano underdog
          fighter2American: -175,  // Duncan favorite
          sportsbook: "DraftKings",
        },
      },
    ],
  },
  {
    id: "ufc-315",
    name: "UFC 315",
    shortName: "UFC 315",
    date: "May 10, 2026",
    venue: "Bell Centre",
    location: "Montreal, Canada",
    broadcast: "ESPN+ PPV",
    fights: [],
  },
  {
    id: "ufc-fight-night-may-2026",
    name: "UFC Fight Night",
    shortName: "Fight Night",
    date: "May 17, 2026",
    venue: "UFC APEX",
    location: "Las Vegas, NV",
    broadcast: "ESPN+",
    fights: [],
  },
];
