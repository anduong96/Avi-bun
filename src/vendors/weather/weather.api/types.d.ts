import { WeatherApi_Conditions } from './constants';

export type WeatherApi_HistoricalParams = {
  dt: string;
  q: string;
};

export type WeatherApi_ForecastParams = {
  days: number;
  q: string;
};

export type WeatherApi_FutureParams = {
  dt: string;
  q: string;
};

export type WeatherApi_Current = {
  air_quality: {
    co: number;
    'gb-defra-index': number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
    so2: number;
    'us-epa-index': number;
  };
  cloud: number;
  condition: WeatherApi_WeatherCondition;
  feelslike_c: number;
  feelslike_f: number;
  gust_kph: number;
  gust_mph: number;
  humidity: number;
  is_day: number;
  last_updated: '2023-11-30 20:45';
  last_updated_epoch: number;
  precip_in: number;
  precip_mm: number;
  pressure_in: number;
  pressure_mb: number;
  temp_c: number;
  temp_f: number;
  uv: number;
  vis_km: number;
  vis_miles: number;
  wind_degree: number;
  wind_dir: 'SSW';
  wind_kph: number;
  wind_mph: number;
};

export type WeatherApi_WeatherCondition = {
  code: (typeof WeatherApi_Conditions)[number]['code'];
  icon: (typeof WeatherApi_Conditions)[number]['icon'];
  text:
    | (typeof WeatherApi_Conditions)[number]['day']
    | (typeof WeatherApi_Conditions)[number]['night'];
};

export type WeatherApi_DayForecast = {
  avghumidity: number;
  avgtemp_c: number;
  avgtemp_f: number;
  avgvis_km: number;
  avgvis_miles: number;
  condition: WeatherApi_WeatherCondition;
  maxtemp_c: number;
  maxtemp_f: number;
  maxwind_kph: number;
  maxwind_mph: number;
  mintemp_c: number;
  mintemp_f: number;
  totalprecip_in: number;
  totalprecip_mm: number;
  uv: number;
};

export type WeatherApi_HourForecast = {
  chance_of_rain: number;
  chance_of_snow: number;
  cloud: number;
  condition: WeatherApi_WeatherCondition;
  dewpoint_c: number;
  dewpoint_f: number;
  feelslike_c: number;
  feelslike_f: number;
  gust_kph: number;
  gust_mph: number;
  heatindex_c: number;
  heatindex_f: number;
  humidity: number;
  is_day: number;
  precip_in: number;
  precip_mm: number;
  pressure_in: number;
  pressure_mb: number;
  temp_c: number;
  temp_f: number;
  time: string;
  time_epoch: number;
  uv: number;
  vis_km: number;
  vis_miles: number;
  will_it_rain: number;
  will_it_snow: number;
  wind_degree: number;
  wind_dir: 'SW';
  wind_kph: number;
  wind_mph: number;
  windchill_c: number;
  windchill_f: number;
};

export type WeatherApi_Location = {
  country: string;
  lat: number;
  localtime: string;
  localtime_epoch: number;
  lon: number;
  name: string;
  region: string;
  tz_id: string;
};

export type WeatherApi_HistoricalResult = {
  current: {
    condition: WeatherApi_WeatherCondition;
    is_day: number;
    last_updated: string;
    last_updated_epoch: number;
    temp_c: number;
    temp_f: number;
  };
  forecast: {
    forecastday: Array<{
      astro: {
        moon_illumination: string;
        moon_phase: string;
        moonrise: string;
        moonset: string;
        sunrise: string;
        sunset: string;
      };
      date: string;
      date_epoch: number;
      day: WeatherApi_DayForecast;
      hour: WeatherApi_HourForecast[];
    }>;
  };
  location: WeatherApi_Location;
};

export type WeatherApi_ForecastResult = {
  current: WeatherApi_Current;
  forecast: {
    forecastday: Array<{
      astro: {
        moon_illumination: string;
        moon_phase: string;
        moonrise: string;
        moonset: string;
        sunrise: string;
        sunset: string;
      };
      date: string;
      date_epoch: number;
      day: WeatherApi_DayForecast;
      hour: WeatherApi_HourForecast[];
    }>;
  };
  location: WeatherApi_Location;
};
