type FlightData = {
  fid: number;
  lastla: number;
  lastlo: number;
  lastlalot: number;
  depsts: number;
  arrsts: number;
  lastlalot: number;
  firstlalot: number;
  svd: number;
  fnia: string;
};

export type RadarBoxCrawlData = {
  current: FlightData & { lastFlight: FlightData };
  route: Record<
    string,
    [
      number, // latitude
      number, // longitude
      number | null, // altitude
    ]
  >;
};
