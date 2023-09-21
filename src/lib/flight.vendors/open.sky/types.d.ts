export type OpenSky_Aircraft = {
  acars: boolean;
  adsb: boolean;
  built: string;
  categoryDescription: string;
  country: string;
  engines: string;
  firstFlightDate?: string;
  firstSeen?: string;
  icao24: string;
  icaoAircraftClass: string;
  lastSeen?: string;
  lineNumber: string;
  manufacturerIcao: string;
  manufacturerName: string;
  model: string;
  modes: boolean;
  notes: string;
  operator: string;
  operatorCallsign: string;
  operatorIata: string;
  operatorIcao: string;
  owner: string;
  regUntil: string;
  registered: null;
  registration: string;
  selCal: string;
  serialNumber: string;
  status: string;
  timestamp: number;
  typecode: string;
  vdl: boolean;
};

export type OpenSky_AircraftPosition = {
  icao24: string;
  callsign: string;
  startTime: number;
  endTime: number;
  path: [
    number /**ts */,
    number /**lat */,
    number /**lng */,
    number /**altitude in meters */,
    number /**true_track */,
    boolean /**on_ground */,
  ][];
};
