export type AeroDataBoxAircraft = {
  active: boolean;
  ageYears: number;
  airlineName: string;
  deliveryDate: string;
  engineType: string;
  firstFlightDate: string;
  hexIcao: string;
  iataCodeShort: string;
  icaoCode: string;
  id: number;
  image?: {
    author: string;
    description: string;
    license: string;
    title: string;
    url: string;
    webUrl: string;
  };
  isFreighter: number;
  model: string;
  modelCode: string;
  numEngines: number;
  numRegistrations: number;
  numSeats: number;
  productionLine: string;
  reg: string;
  registration: Array<{
    active: boolean;
    airlineName: string;
    hexIcao: string;
    reg: string;
    registrationDate: string;
  }>;
  registrationDate: string;
  rolloutDate: string;
  serial: string;
  typeName: string;
  verified: boolean;
};

export type AeroDataBoxFlight = {
  aircraft: {
    model?: string;
    reg?: string;
  };
  airline: {
    iata: string;
    icao: string;
    name: string;
  };
  arrival: {
    actualTimeLocal?: string;
    actualTimeLocal: string;
    actualTimeUtc?: string;
    actualTimeUtc: string;
    airport: {
      countryCode: string;
      iata: string;
      icao: string;
      location: {
        lat: number;
        lon: number;
      };
      municipalityName: string;
      name: string;
      shortName: string;
    };
    baggageBelt?: string;
    quality: string[];
    revisedTime: {
      local: string;
      utc: string;
    };
    runwayTimeLocal?: string;
    runwayTimeUtc?: string;
    scheduledTime: {
      local: string;
      utc: string;
    };
    scheduledTimeLocal: string;
    scheduledTimeUtc?: string;
    scheduledTimeUtc: string;
    terminal: string;
  };
  codeshareStatus: string;
  departure: {
    actualTimeLocal?: string;
    actualTimeUtc?: string;
    airport: {
      countryCode: string;
      iata: string;
      icao: string;
      location: {
        lat: number;
        lon: number;
      };
      municipalityName: string;
      name: string;
      shortName: string;
    };
    quality: string[];
    runwayTimeLocal?: string;
    runwayTimeUtc?: string;
    scheduledTime: {
      local: string;
      utc: string;
    };
    scheduledTimeLocal: string;
    scheduledTimeUtc?: string;
    scheduledTimeUtc: string;
    terminal: string;
  };
  greatCircleDistance: {
    feet: number;
    km: number;
    meter: number;
    mile: number;
    nm: number;
  };
  isCargo: boolean;
  lastUpdatedUtc: string;
  number: string;
  status: 'Arrived' | 'Departed' | 'Expected' | 'Unknown';
};
