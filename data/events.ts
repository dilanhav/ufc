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
      // ── MAIN CARD ──────────────────────────────────────────────────────────
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
          fighter1American: +170,
          fighter2American: -205,
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
          fighter1American: -120,
          fighter2American: +100,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "yakhyaev-ribeiro",
        fighter1Id: "yakhyaev",
        fighter2Id: "ribeiro",
        weightClass: "Light Heavyweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: true,
        odds: {
          fighter1American: -1400,
          fighter2American: +850,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "ewing-estevam",
        fighter1Id: "ewing",
        fighter2Id: "estevam",
        weightClass: "Bantamweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: true,
        odds: {
          fighter1American: +185,
          fighter2American: -215,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "mcmillen-zecchini",
        fighter1Id: "mcmillen",
        fighter2Id: "zecchini",
        weightClass: "Featherweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: true,
        odds: {
          fighter1American: -1200,
          fighter2American: +750,
          sportsbook: "DraftKings",
        },
      },
      // ── PRELIMS ────────────────────────────────────────────────────────────
      {
        id: "delano-ruchala",
        fighter1Id: "delano",
        fighter2Id: "ruchala",
        weightClass: "Featherweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: false,
        odds: {
          fighter1American: -325,
          fighter2American: +260,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "pat-petersen",
        fighter1Id: "pat",
        fighter2Id: "petersen",
        weightClass: "Heavyweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: false,
        odds: {
          fighter1American: +110,
          fighter2American: -130,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "costa-nicoll",
        fighter1Id: "costa_ale",
        fighter2Id: "nicoll",
        weightClass: "Women's Flyweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: false,
        odds: {
          fighter1American: -425,
          fighter2American: +320,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "bekoev-gore",
        fighter1Id: "bekoev",
        fighter2Id: "gore",
        weightClass: "Middleweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: false,
        odds: {
          fighter1American: -850,
          fighter2American: +625,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "barbosa-gatto",
        fighter1Id: "barbosa",
        fighter2Id: "gatto",
        weightClass: "Women's Flyweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: false,
        odds: {
          fighter1American: +105,
          fighter2American: -125,
          sportsbook: "DraftKings",
        },
      },
      {
        id: "kamaka-hope",
        fighter1Id: "kamaka",
        fighter2Id: "hope",
        weightClass: "Lightweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        isMainCard: false,
        odds: {
          fighter1American: -155,
          fighter2American: +126,
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
          fighter1American: -245,
          fighter2American: +194,
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
          fighter1American: +120,
          fighter2American: -140,
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
