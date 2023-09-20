export type AeroDataBoxAircraft = {
  id: number;
  reg: string;
  active: boolean;
  serial: string;
  hexIcao: string;
  airlineName: string;
  iataCodeShort: string;
  icaoCode: string;
  model: string;
  modelCode: string;
  numSeats: number;
  rolloutDate: string;
  firstFlightDate: string;
  deliveryDate: string;
  registrationDate: string;
  typeName: string;
  numEngines: number;
  engineType: string;
  isFreighter: number;
  productionLine: string;
  ageYears: number;
  verified: boolean;
  numRegistrations: number;
  image?: {
    url: string;
    webUrl: string;
    author: string;
    title: string;
    description: string;
    license: string;
  };
  registration: Array<{
    reg: string;
    active: boolean;
    hexIcao: string;
    airlineName: string;
    registrationDate: string;
  }>;
};

export type AeroDataBoxFlight = {
  lastUpdatedUtc: string;
  number: string;
  status: 'Arrived' | 'Unknown' | 'Expected' | 'Departed';
  codeshareStatus: string;
  isCargo: boolean;
  greatCircleDistance: {
    meter: number;
    km: number;
    mile: number;
    nm: number;
    feet: number;
  };
  departure: {
    quality: string[];
    terminal: string;
    actualTimeLocal?: string;
    runwayTimeLocal?: string;
    scheduledTimeUtc?: string;
    actualTimeUtc?: string;
    runwayTimeUtc?: string;
    scheduledTimeLocal: string;
    scheduledTimeUtc: string;
    scheduledTime: {
      utc: string;
      local: string;
    };
    airport: {
      icao: string;
      iata: string;
      name: string;
      shortName: string;
      municipalityName: string;
      countryCode: string;
      location: {
        lat: number;
        lon: number;
      };
    };
  };
  arrival: {
    airport: {
      icao: string;
      iata: string;
      name: string;
      shortName: string;
      municipalityName: string;
      countryCode: string;
      location: {
        lat: number;
        lon: number;
      };
    };
    actualTimeLocal?: string;
    runwayTimeLocal?: string;
    scheduledTimeUtc?: string;
    actualTimeUtc?: string;
    runwayTimeUtc?: string;
    scheduledTimeLocal: string;
    actualTimeLocal: string;
    scheduledTimeUtc: string;
    actualTimeUtc: string;
    scheduledTime: {
      utc: string;
      local: string;
    };
    revisedTime: {
      utc: string;
      local: string;
    };
    terminal: string;
    baggageBelt?: string;
    quality: string[];
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  aircraft: {
    model?: string;
    reg?: string;
  };
};
