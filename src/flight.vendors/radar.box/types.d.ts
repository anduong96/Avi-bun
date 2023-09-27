export type RadarBoxCrawlData = {
  current: {
    fid: number;
    lastla: number;
    lastlo: number;
    lastlalot: number;
    lastFlight: {
      fid: number;
      lastla: number;
      lastlo: number;
      lastlalot: number;
    };
  };
  route: Record<
    string,
    [
      number, // latitude
      number, // longitude
      number | null, // altitude
    ]
  >;
};
