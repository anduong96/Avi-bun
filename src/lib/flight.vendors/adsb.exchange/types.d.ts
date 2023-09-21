type ADSB_AircraftTraceExtra = {
  alert: number /** Flight status alert bit (2.2.3.2.3.2) */;
  alt_geom: number /** geometric (GNSS / INS) altitude in feet referenced to the WGS84 ellipsoid */;
  baro_rate: number /**  Rate of change of barometric altitude, feet/minute */;
  category: string;
  emergency: string;
  flight: string;
  gva: number;
  nac_p: number;
  nac_v: number;
  nav_altitude_mcp: number;
  nav_heading: number;
  nav_qnh: number;
  nic: number;
  nic_baro: number;
  rc: number;
  sda: number;
  sil: number;
  sil_type: string;
  spi: number;
  squawk: string;
  track: number;
  type: string;
  version: number;
};

/**
 * @see {@link https://www.adsbexchange.com/version-2-api-wip/}
 */
export type ADSB_AircraftTrace = {
  icao: string;
  r: string;
  t: string;
  dbFlags: number;
  desc: string;
  ownOp: string;
  year: string;
  timestamp: number;
  trace: [
    number /** seconds after timestamp */,
    number /** latitude */,
    number /** longitude */,
    "grounded" | number | null /** altitude in ft or "ground" or null */,
    number | null /**ground speed in knots or null */,
    number | null /**track in degrees or null*/,
    number /** flags as a bitfield */,
    number /** vertical rate in fpm or null */,
    ADSB_AircraftTraceExtra,
    string /** source of this position or null */,
    number | null /** geometric altitude or null */,
    number | null /** geometric vertical rate or null, */,
    number | null /** indicated airspeed or null, */,
    number | null /** roll angle or null */,
  ][];
};
