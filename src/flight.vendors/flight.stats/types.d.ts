import { FlightStats_Status } from './flight.stats.enums';

export type FlightStatResp<T> = {
  data: T;
};

export type FlightStatAirport = {
  active: boolean;
  icao: string;
  fs: string;
  iata: string;
  name: string;
  city: string;
  state: string;
  country: string;
  timeZoneRegionName: string;
  regionName: string;
  gate?: string;
  terminal?: string;
  date: string;
};

export type FlightStatFlight = FlightStatResp<{
  flightId: number;
  departureAirport: FlightStatAirport;
  arrivalAirport: FlightStatAirport;
  flightNote: {
    final: boolean;
    canceled: boolean;
    hasDepartedGate: boolean;
    hasDepartedRunway: boolean;
    landed: boolean;
    message: string;
    messageCode: string;
    pastExpectedTakeOff: boolean;
    tracking: boolean;
    hasPositions: boolean;
    trackingUnavailable: boolean;
    phase: unknown;
    hasActualRunwayDepartureTime: boolean;
    hasActualGateDepartureTime: boolean;
  };
  schedule: {
    scheduledDeparture: string;
    scheduledDepartureUTC: string;
    estimatedActualDepartureRunway: boolean;
    estimatedActualDeparture: string;
    estimatedActualDepartureUTC: string;
    scheduledArrival: string;
    scheduledArrivalUTC: string;
    estimatedActualArrivalRunway: boolean;
    estimatedActualArrival: string;
    estimatedActualArrivalUTC: string;
    tookOff: string;
  };
  positional: {
    flextrack: {
      bearing: number;
      heading: number;
      delayMinutes: number;
      position: Array<{
        lon: number;
        lat: number;
        speedMph: number;
        altitudeFt: number;
        source: string;
        date: string;
        course: number;
        vrateMps: number;
        lastObserved: string;
      }>;
    };
  };
  status: {
    status: FlightStats_Status;
    diverted: boolean;
    delay: {
      departure: {
        minutes: number;
      };
      arrival: {
        minutes: number;
      };
    };
    delayStatus: {
      minutes: number;
    };
  };
}>;

export type SearchFlightParam = {
  date: Date;
  airlineIata: string;
  flightNumber: string;
};

export type FlightStatAirportCondition = {
  detailsHeader: {
    code: string;
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    countryCode: StringRegexOptions;
    currentDate: string;
    currentTime: string;
    currentDateTime: string;
    timeZoneRegionName: string;
    currentDateMDY: string;
    currentTimeAMPM: string;
    stateCode: string;
    timeZone: string;
    latitude: number;
    longitude: number;
  };
  delayIndex: {
    observed: boolean;
    score: number;
    status: string;
    trend: string;
    lastUpdated: string;
  };
  currentWeather: {
    tempF: number;
    tempC: number;
    direction: number;
    hideCurrentWeatherConditionsCard: boolean;
    sky: string;
    icon: string;
    visibility: {
      miles: number;
      km: number;
    };
    wind: {
      knots: number;
      mph: number;
      kph: number;
    };
  };
  forecastWeather: Array<{
    date: string;
    dateMDY: string;
    day1: string;
    des1: string;
    icon: string;
    day2: string;
    des2: string;
    icon2: string;
  }>;
};

export type FlightStatPromptness = {
  airline: {
    active: boolean;
    category: string;
    flightNumber: string;
    fs: string;
    iata: string;
    icao: string;
    name: string;
  };
  arrivalAirport: {
    active: true;
    city: string;
    classification: number;
    country: string;
    fs: string;
    iata: string;
    icao: string;
    name: string;
    state: string;
    timeZoneRegionName: string;
  };
  departureAirport: {
    active: true;
    city: string;
    classification: number;
    country: string;
    fs: string;
    iata: string;
    icao: string;
    name: string;
    state: string;
    timeZoneRegionName: string;
  };
  chart: {
    cancelled: number;
    diverted: number;
    excessive: number;
    late: number;
    onTime: number;
    veryLate: number;
  };
  details: {
    delayPerformance: {
      appraisal: string;
      cumulative: number;
      delayMean: number;
      roundedStars: number;
      standardDeviation: number;
      stars: number;
    };
    otp: {
      appraisal: string;
      cumulative: number;
      ontimePercent: number;
      roundedStars: number;
      stars: number;
    };
    overall: {
      appraisal: string;
      cumulative: number;
      delayMean: number;
      ontimePercent: number;
      roundedStars: number;
      stars: number;
    };
  };
  statistics: {
    codeshares: number;
    delayObservations: number;
    max: number;
    mean: number;
    min: number;
    standardDeviation: number;
    totalObservations: number;
  };
};

export type FlightDetails = {
  flightId: number;
  flightState: 'en-route';
  sortTime: string;
  url: string;
  carrier: {
    active: true;
    category: string;
    flightNumber: string;
    fs: string;
    iata: string;
    icao: string;
    name: string;
  };
  additionalFlightInfo: {
    equipment: {
      iata: string;
      name: string;
      tailNumber: string;
      title: string;
    };
    flightDuration: {
      estimated: string;
      scheduled: string;
    };
  };
  eventTimeline: Array<{
    arrivalAirportTime: string;
    arrivalAirportTime24: string;
    date1: string;
    date2: string;
    departureAirportTime: string;
    departureAirportTime24: string;
    shortTitle: string;
    sortTime: string;
    source: string;
    title: string;
    utcTime: string;
    events: Array<
      | {
          changed: string;
          newDate: boolean;
          fromAMPM0: string;
          fromAMPM1: string;
          fromMonth0: string;
          fromMonth1: string;
          fromTime0: string;
          fromTime1: string;
        }
      | {
          changed: string;
          fromAMPM0: string;
          fromAMPM1: string;
          fromMonth0: string;
          fromMonth1: string;
          fromTime0: string;
          fromTime1: string;
          newDate: boolean;
          oldDate: boolean;
          toAMPM0: string;
          toAMPM1: string;
          toMonth0: string;
          toMonth1: string;
          toTime0: string;
          toTime1: string;
        }
      | {
          eventText: string;
          noAdjustment: boolean;
        }
    >;
  }>;
  schedule: {
    actualGateDeparture?: string;
    actualGateDepartureUTC?: string;
    actualRunwayDeparture?: string;
    actualRunwayDepartureUTC?: string;
    actualGateArrival?: string;
    actualGateArrivalUTC?: string;
    actualRunwayArrival?: string;
    actualRunwayArrivalUTC?: string;
    estimatedGateArrival: string;
    estimatedGateArrivalUTC: string;
    estimatedGateDeparture: string;
    estimatedGateDepartureUTC: string;
    scheduledGateArrival: string;
    scheduledGateArrivalUTC: string;
    scheduledGateDeparture: string;
    scheduledGateDepartureUTC: string;
    scheduledRunwayArrival: string;
    scheduledRunwayArrivalUTC: string;
    scheduledRunwayDeparture: string;
    scheduledRunwayDepartureUTC: string;
  };
  status: {
    color: string;
    diverted: boolean;
    showEst: boolean;
    status: FlightStats_Status;
    statusCode: 'A';
    statusDescription: string;
    delay: {
      delayStatus: {
        minutes: number;
        wording: string;
      };
      arrival: {
        gateMinutes: number;
        runwayMinutes: number;
        hasArrivalTime: number;
      };
      departure: {
        gateMinutes: number;
        runwayMinutes: number;
      };
    };
  };
} & {
  [key in 'arrivalAirport' | 'departureAirport']: FlightStatAirport & {
    times: {
      [item in
        | 'estimatedGate'
        | 'estimatedRunway'
        | 'scheduledGate'
        | 'scheduledRunway']: {
        ampm: 'am' | 'pm';
        time: string;
        time24: string;
        timezone: string;
      };
    };
  };
};

export type FlightProgress = {
  bearing: number;
  carrierFlightId: string;
  carrierFs: string;
  carrierName: string;
  flightEquipmentIata: string;
  flightEquipmentName: string;
  flightId: string;
  flightStatus: string;
  heading: number;
  responseTime: number;
  statusAppend: string;
  statusAppendKey: number;
  statusCode: number;
  statusColor: string;
  statusName: 'DEPARTED';
  positions: Array<{
    altitudeFt: number;
    course: number;
    date: string;
    lastObserved: string;
    lat: number;
    lon: number;
    source: 'derived';
    speedMph: number;
    vrateMps: number;
  }>;
  flightPlan: Array<{
    lat: number;
    lon: number;
  }>;
  miniTracker: {
    arrivalAirport: string;
    departureAirport: string;
    flightStatusCode: string;
    isActualArrivalTime: boolean;
    isActualDepartureTime: boolean;
    kilometersFromDeparture: number;
    kilometersToArrival: number;
    localArrivalTime: number;
    localArrivalTimeString: string;
    localDepartureTime: number;
    localDepartureTimeString: string;
    statusName: 'DEPARTED';
    totalKilometers: number;
    utcActualRunwayArrivalTime?: string;
    utcActualRunwayDepartureTime: number;
    utcArrivalTime: validator;
    utcDepartureTime: number;
  };
};

export type RandomFlight = {
  _source: {
    flightId: number;
    flightNumber: string;
    carrier: string;
    carrierIata: string;
    departureDateTime: string;
    departureGate?: string;
    departureTerminal: string;
    departureTimeZone: string;
  };
};

export type FlightSearchItem = {
  _source: {
    flightId: number;
    flightNumber: string;
    carrier: string;
    carrierIata: string;
    departureAirport: string;
    departureAirportCity: string;
    departureAirportName: string;
    departureDateTime: string;
    departureTimeZone: string;
    departureGate?: string;
    departureTerminal?: string;

    scheduledGateDeparture: string;
    scheduledRunwayDeparture: string;
    scheduledGateArrival: string;
    scheduledRunwayArrival: string;

    estimatedGateDeparture: string;
    estimatedRunwayDeparture: string;
    estimatedGateArrival: string;
    estimatedRunwayArrival: string;

    actualGateDeparture?: string;
    actualRunwayDeparture?: string;
    actualGateArrival?: string;
    actualRunwayArrival?: string;

    arrivalAirport: string;
    arrivalAirportCity: string;
    arrivalAirportName: string;
    arrivalGate?: string;
    arrivalTerminal?: string;
    arrivalDateTime: string;
    arrivalTimeZone: string;
    status: string;

    scheduledEquipment?: string;
  };
};

export type FlightStatSearchItemV2 = {
  date1: string;
  date2: string;
  day: string;
  year: string;
  flights: Array<{
    arrivalAirport: {
      city: string;
      fs: string;
      iata: string;
      name: string;
      state: string;
      country: string;
    };
    departureAirport: {
      city: string;
      fs: string;
      iata: string;
      name: string;
      state: string;
      country: string;
    };
    url: string;
    arrivalTime: string;
    arrivalTimeAmPm: 'AM' | 'PM';
    arrivalTimezone: string;
    departureAirport: {
      iata: string;
    };
    departureTime: string;
    departureTimeAmPm: 'AM' | 'PM';
    departureTime24: string;
    departureTimezone: string;
    sortTime: string;
  }>;
};
