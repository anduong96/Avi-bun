type FlightData = {
  fid: number;
  svd: number;
  fnia: string;
  apdsttzns: string;
  aporgtzns: string;
  aporgia: string /** Departure Airport IATA */;
  apdstia: string /** Arrival Airport IATA */;
  apdsttzns: string /** Arrival Timezone */;
  aplngtzns: string /** Departure Timezone */;
  apdsttz: number /** Arrival UTC offset in hours */;
  aplngtz: number /** Deparuture UTC offset in hours */;
  depdate: string /** Departure Date */;
} & (
  | {
      firstlalot: null;
    }
  | {
      firstlalot: number;
      lastla: number /** Last recorded latitude for current trip */;
      lastlo: number /** Last recorded longitiude for current trip */;
      lastlalot: number /** Last recorded coordinate for current trip */;
      depsts: number /** Departure time epoc */;
      arrsts: number /** Arrival time epoc */;
      lastlalot: number /** Last recorded coordinate for current trip */;
      firstlalot: number /** First recorded coordinate for current trip */;
      alt: number /** Altitude */;
    }
);

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
