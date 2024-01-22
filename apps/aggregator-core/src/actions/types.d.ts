export interface AggregatedData<G = Game, W = Weather> {
  requestId: number;
  gameId: number;
  weather?: W;
  game?: G;
  date: Date;
}

type val = number | string | null;

interface Weather {
  conditions?: string | null;
  temperature?: val;
  humidity?: val;
  windSpeed?: val;
  windDirection?: val;
  visibility?: val;
  precipitation?: val;
  cloudCover?: val;
  solarRadiation?: val;
  dewPoint?: val;
  windChill?: val;
  meta: {
    dateTime: string;
    location: val;
    timeZone: string | null;
  };
}

export interface NBAGame {
  id: number;
  date: string;
  home_team: Team;
  home_team_score: number;
  period: number;
  postseason: boolean;
  season: number;
  status: string;
  time: string;
  visitor_team: Team;
  visitor_team_score: number;
}

export interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface Action {
  run(body: unknown): unknown;
}
