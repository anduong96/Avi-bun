type FlightData = {
  apdstia: string /** Arrival Airport IATA */;
  apdsttz: number /** Arrival UTC offset in hours */;
  apdsttzns: string;
  apdsttzns: string /** Arrival Timezone */;
  aplngtz: number /** Departure UTC offset in hours */;
  aplngtzns: string /** Departure Timezone */;
  aporgia: string /** Departure Airport IATA */;
  arrdate_utc: string /** Arrival Date UTC */;
  arrs_utc: string /** Arrival Time UTC */;
  depdate: string /** Departure Date */;
  depdate_utc: string /** Departure Date UTC */;
  deps_utc: string /** Departure Time UTC */;
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
