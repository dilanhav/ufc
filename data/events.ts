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
    id: "ufc-314",
    name: "UFC 314",
    shortName: "UFC 314",
    date: "April 12, 2025",
    venue: "Kaseya Center",
    location: "Miami, FL",
    broadcast: "ESPN+ PPV",
    fights: [
      {
        id: "volkanovski-lopes-2",
        fighter1Id: "volkanovski",
        fighter2Id: "lopes",
        weightClass: "Featherweight",
        isMainEvent: true,
        isCoMainEvent: false,
        isTitleFight: true,
        titleType: "Undisputed",
        fighter1Ranking: 1,
        fighter2Ranking: 2,
      },
      {
        id: "moicano-duncan",
        fighter1Id: "moicano",
        fighter2Id: "duncan",
        weightClass: "Lightweight",
        isMainEvent: false,
        isCoMainEvent: false,
        isTitleFight: false,
        fighter1Ranking: 7,
        fighter2Ranking: undefined,
      },
    ],
  },
  {
    id: "ufc-fight-night-april-19",
    name: "UFC Fight Night",
    shortName: "Fight Night",
    date: "April 19, 2025",
    venue: "UFC APEX",
    location: "Las Vegas, NV",
    broadcast: "ESPN+",
    fights: [],
  },
  {
    id: "ufc-315",
    name: "UFC 315",
    shortName: "UFC 315",
    date: "May 10, 2025",
    venue: "Bell Centre",
    location: "Montreal, Canada",
    broadcast: "ESPN+ PPV",
    fights: [],
  },
];
