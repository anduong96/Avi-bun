import ky from 'ky';

import { Coordinates } from '@app/types/coordinates';

import { MetNo_WeatherForecastResponse } from './types';

export class MetNoApi {
  static readonly MAX_FORECAST_DAYS = 9;
  private static readonly baseURL = 'https://api.met.no/weatherapi';
  private static client = ky.create({ prefixUrl: this.baseURL });

  static async getWeatherForecast(coordinate: Coordinates) {
    const route = 'locationforecast/2.0/compact';
    const data = await this.client
      .get(route, {
        searchParams: {
          lat: coordinate.latitude,
          lon: coordinate.longitude,
        },
      })
      .json<MetNo_WeatherForecastResponse>();

    return data;
  }
}
