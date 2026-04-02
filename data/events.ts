export interface BettingOdds {
  fighter1American: number;
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
  isMainCard: boolean;
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
    shortName: "UFC Vegas 115",
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
        isMainCard: true,
        odds: {
          fighter1American: +145,
          fighter2American: -175,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "jandiroba-ricci",
        fighter1Id: "jandiroba",
        fighter2Id: "ricci",
        weightClass: "Women's Strawweight",
        isMainEvent: false,
        isCoMainEvent: true,
        isTitleFight: false,
        fighter1Ranking: 3,
        fighter2Ranking: 11,
        isMainCard: true,
        odds: {
          fighter1American: -160,
          fighter2American: +130,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "shahbazyan-park",
        fighter1Id: "shahbazyan",
        fighter2Id: "park",
        weightClass: "Middleweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: true,
        odds: {
          fighter1American: -145,
          fighter2American: +120,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "vannata-flowers",
        fighter1Id: "vannata",
        fighter2Id: "flowers",
        weightClass: "Lightweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: false,
        odds: {
          fighter1American: -130,
          fighter2American: +108,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "cowan-pereira",
        fighter1Id: "cowan",
        fighter2Id: "pereira_alice",
        weightClass: "Women's Bantamweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: false,
        odds: {
          fighter1American: -155,
          fighter2American: +128,
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
