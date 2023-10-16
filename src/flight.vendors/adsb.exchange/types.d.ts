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
  dbFlags: number;
  desc: string;
  icao: string;
  ownOp: string;
  r: string;
  t: string;
  timestamp: number;
  trace: [
    number /** seconds after timestamp */,
    number /** latitude */,
    number /** longitude */,
    'grounded' | null | number /** altitude in ft or "ground" or null */,
    null | number /**ground speed in knots or null */,
    null | number /**track in degrees or null*/,
    number /** flags as a bitfield */,
    number /** vertical rate in fpm or null */,
    ADSB_AircraftTraceExtra,
    string /** source of this position or null */,
    null | number /** geometric altitude or null */,
    null | number /** geometric vertical rate or null, */,
    null | number /** indicated airspeed or null, */,
    null | number /** roll angle or null */,
  ][];
  year: string;
};
