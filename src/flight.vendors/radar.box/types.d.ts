type FlightData = {
  apdstia: string /** Arrival Airport IATA */;
  apdsttz: number /** Arrival UTC offset in hours */;
  apdsttzns: string;
  apdsttzns: string /** Arrival Timezone */;
  aplngtz: number /** Deparuture UTC offset in hours */;
  aplngtzns: string /** Departure Timezone */;
  aporgia: string /** Departure Airport IATA */;
  aporgtzns: string;
  depdate: string /** Departure Date */;
  fid: number;
  fnia: string;
  svd: number;
} & (
  | {
      alt: number /** Altitude */;
      arrsts: number /** Arrival time epoc */;
      depsts: number /** Departure time epoc */;
      firstlalot: number;
      firstlalot: number /** First recorded coordinate for current trip */;
      lastla: number /** Last recorded latitude for current trip */;
      lastlalot: number /** Last recorded coordinate for current trip */;
      lastlalot: number /** Last recorded coordinate for current trip */;
      lastlo: number /** Last recorded longitiude for current trip */;
    }
  | {
      firstlalot: null;
    }
);

export type RadarBoxCrawlData = {
  current: FlightData & { lastFlight: FlightData };
  route: Record<
    string,
    [
      number, // latitude
      number, // longitude
      null | number, // altitude
    ]
  >;
};
