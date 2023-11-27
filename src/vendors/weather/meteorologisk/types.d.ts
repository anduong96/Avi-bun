export type MetNoWeatherForecastResponse = {
  geometry: {
    coordinates: number[];
    type: 'Point';
  };
  properties: {
    meta: {
      units: {
        air_pressure_at_sea_level: 'hPa';
        air_temperature: 'celsius';
        cloud_area_fraction: '%';
        precipitation_amount: 'mm';
        relative_humidity: '%';
        wind_from_direction: 'degrees';
        wind_speed: 'm/s';
      };
      updated_at: string;
    };
    timeseries: Array<{
      data: {
        instant: {
          details: {
            air_pressure_at_sea_level: number;
            air_temperature: number;
            cloud_area_fraction: number;
            relative_humidity: number;
            wind_from_direction: number;
            wind_speed: number;
          };
        };
      } & Partial<
        Record<
          'next_1_hours' | 'next_6_hours' | 'next_12_hours',
          {
            details: {
              precipitation_amount?: number;
            };
            summary: {
              symbol_code:
                | 'clearsky_day'
                | 'clearsky_night'
                | 'cloudy'
                | 'fair_day'
                | 'fair_night'
                | 'fog'
                | 'heavyrain'
                | 'heavyrainshowers_night'
                | 'heavysleet'
                | 'heavysleetshowers_night'
                | 'heavysnow'
                | 'lightrain'
                | 'lightrainshowers_day'
                | 'lightrainshowers_night'
                | 'lightsleet'
                | 'lightsleetshowers_day'
                | 'lightsleetshowers_night'
                | 'lightsnow'
                | 'lightsnowshowers_day'
                | 'lightsnowshowers_night'
                | 'partlycloudy_day'
                | 'partlycloudy_night'
                | 'rain'
                | 'rainshowers_day'
                | 'rainshowers_night'
                | 'sleet'
                | 'sleetshowers_day'
                | 'sleetshowers_night'
                | 'snow';
            };
          }
        >
      >;
      time: string;
    }>;
  };
  type: 'Feature';
};
