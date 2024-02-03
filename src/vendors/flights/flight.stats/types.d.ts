import { FlightStats_Status } from './flight.stats.enums';

export type FlightStatResp<T> = {
  data: T;
};

export type FlightStatAirport = {
  active: boolean;
  city: string;
  country: string;
  date: string;
  fs: string;
  gate?: string;
  iata: string;
  icao: string;
  name: string;
  regionName: string;
  state: string;
  terminal?: string;
  timeZoneRegionName: string;
};

export type FlightStatFlight = FlightStatResp<{
  arrivalAirport: FlightStatAirport;
  departureAirport: FlightStatAirport;
  flightId: number;
  flightNote: {
    canceled: boolean;
    final: boolean;
    hasActualGateDepartureTime: boolean;
    hasActualRunwayDepartureTime: boolean;
    hasDepartedGate: boolean;
    hasDepartedRunway: boolean;
    hasPositions: boolean;
    landed: boolean;
    message: string;
    messageCode: string;
    pastExpectedTakeOff: boolean;
    phase: unknown;
    tracking: boolean;
    trackingUnavailable: boolean;
  };
  positional: {
    flextrack: {
      bearing: number;
      delayMinutes: number;
      heading: number;
      position: Array<{
        altitudeFt: number;
        course: number;
        date: string;
        lastObserved: string;
        lat: number;
        lon: number;
        source: string;
        speedMph: number;
        vrateMps: number;
      }>;
    };
  };
  schedule: {
    estimatedActualArrival: string;
    estimatedActualArrivalRunway: boolean;
    estimatedActualArrivalUTC: string;
    estimatedActualDeparture: string;
    estimatedActualDepartureRunway: boolean;
    estimatedActualDepartureUTC: string;
    scheduledArrival: string;
    scheduledArrivalUTC: string;
    scheduledDeparture: string;
    scheduledDepartureUTC: string;
    tookOff: string;
  };
  status: {
    delay: {
      arrival: {
        minutes: number;
      };
      departure: {
        minutes: number;
      };
    };
    delayStatus: {
      minutes: number;
    };
    diverted: boolean;
    status: FlightStats_Status;
  };
}>;

export type SearchFlightParam = {
  airlineIata: string;
  date: Date;
  flightNumber: string;
};

export type FlightStatAirportCondition = {
  currentWeather: {
    direction: number;
    hideCurrentWeatherConditionsCard: boolean;
    icon: string;
    sky: string;
    tempC: number;
    tempF: number;
    visibility: {
      km: number;
      miles: number;
    };
    wind: {
      knots: number;
      kph: number;
      mph: number;
    };
  };
  delayIndex: {
    lastUpdated: string;
    observed: boolean;
    score: number;
    status: string;
    trend: string;
  };
  detailsHeader: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    code: string;
    countryCode: StringRegexOptions;
    currentDate: string;
    currentDateMDY: string;
    currentDateTime: string;
    currentTime: string;
    currentTimeAMPM: string;
    latitude: number;
    longitude: number;
    name: string;
    stateCode: string;
    timeZone: string;
    timeZoneRegionName: string;
  };
  forecastWeather: Array<{
    date: string;
    dateMDY: string;
    day1: string;
    day2: string;
    des1: string;
    des2: string;
    icon: string;
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
  chart: {
    cancelled: number;
    diverted: number;
    excessive: number;
    late: number;
    onTime: number;
    veryLate: number;
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
  additionalFlightInfo: {
    equipment?: {
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
  carrier: {
    active: true;
    category: string;
    flightNumber: string;
    fs: string;
    iata: string;
    icao: string;
    name: string;
  };
  eventTimeline: Array<{
    arrivalAirportTime: string;
    arrivalAirportTime24: string;
    date1: string;
    date2: string;
    departureAirportTime: string;
    departureAirportTime24: string;
    events: Array<
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
          changed: string;
          fromAMPM0: string;
          fromAMPM1: string;
          fromMonth0: string;
          fromMonth1: string;
          fromTime0: string;
          fromTime1: string;
          newDate: boolean;
        }
      | {
          changed: string;
          newDate: boolean;
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
    shortTitle: string;
    sortTime: string;
    source: string;
    title: string;
    utcTime: string;
  }>;
  flightId: number;
  flightState: 'en-route';
  schedule: {
    actualGateArrival?: string;
    actualGateArrivalUTC?: string;
    actualGateDeparture?: string;
    actualGateDepartureUTC?: string;
    actualRunwayArrival?: string;
    actualRunwayArrivalUTC?: string;
    actualRunwayDeparture?: string;
    actualRunwayDepartureUTC?: string;
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
  sortTime: string;
  status?: {
    color: string;
    delay: {
      arrival: {
        gateMinutes: number;
        hasArrivalTime: number;
        runwayMinutes: number;
      };
      delayStatus: {
        minutes: number;
        wording: string;
      };
      departure: {
        gateMinutes: number;
        runwayMinutes: number;
      };
    };
    diverted: boolean;
    showEst: boolean;
    status: FlightStats_Status;
    statusCode: 'A';
    statusDescription: string;
  };
  url: string;
} & {
  [key in 'arrivalAirport' | 'departureAirport']: FlightStatAirport & {
    baggage?: string;
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
  flightPlan: Array<{
    lat: number;
    lon: number;
  }>;
  flightStatus: string;
  heading: number;
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
  responseTime: number;
  statusAppend: string;
  statusAppendKey: number;
  statusCode: number;
  statusColor: string;
  statusName: 'DEPARTED';
};

export type RandomFlight = {
  _source: {
    carrier: string;
    carrierIata: string;
    departureDateTime: string;
    departureGate?: string;
    departureTerminal: string;
    departureTimeZone: string;
    flightId: number;
    flightNumber: string;
    tailNumber: string;
  };
};

export type FlightSearchItem = {
  _source: {
    actualGateArrival?: string;
    actualGateDeparture?: string;
    actualRunwayArrival?: string;
    actualRunwayDeparture?: string;
    arrivalAirport: string;
    arrivalAirportCity: string;
    arrivalAirportName: string;
    arrivalDateTime: string;
    arrivalGate?: string;
    arrivalTerminal?: string;
    arrivalTimeZone: string;

    carrier: string;
    carrierIata: string;
    departureAirport: string;
    departureAirportCity: string;

    departureAirportName: string;
    departureDateTime: string;
    departureGate?: string;
    departureTerminal?: string;

    departureTimeZone: string;
    estimatedGateArrival: string;
    estimatedGateDeparture: string;
    estimatedRunwayArrival: string;

    estimatedRunwayDeparture: string;
    flightId: number;
    flightNumber: string;
    scheduledEquipment?: string;
    scheduledGateArrival: string;
    scheduledGateDeparture: string;
    scheduledRunwayArrival: string;
    scheduledRunwayDeparture: string;

    status: string;
  };
};

export type FlightStatSearchItemV2 = {
  date1: string;
  date2: string;
  day: string;
  flights: Array<{
    arrivalAirport: {
      city: string;
      country: string;
      fs: string;
      iata: string;
      name: string;
      state: string;
    };
    arrivalTime: string;
    arrivalTimeAmPm: 'AM' | 'PM';
    arrivalTimezone: string;
    departureAirport: {
      city: string;
      country: string;
      fs: string;
      iata: string;
      name: string;
      state: string;
    };
    departureAirport: {
      iata: string;
    };
    departureTime: string;
    departureTime24: string;
    departureTimeAmPm: 'AM' | 'PM';
    departureTimezone: string;
    sortTime: string;
    url: string;
  }>;
  year: string;
};
