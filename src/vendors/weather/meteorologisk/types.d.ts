import { MetNo_WeatherConditions } from './constants';

export type MetNo_Conditions = (typeof MetNo_WeatherConditions)[number];

export type MetNo_WeatherForecastResponse = {
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
              symbol_code: MetNo_Conditions;
            };
          }
        >
      >;
      time: string;
    }>;
  };
  type: 'Feature';
};
