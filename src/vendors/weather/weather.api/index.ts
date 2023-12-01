import ky from 'ky';
import moment from 'moment';
import { format } from 'sys';

import { ENV } from '@app/env';
import { Logger } from '@app/lib/logger';
import { Coordinates } from '@app/types/coordinates';
import { getCoordinateString } from '@app/lib/coordinate.string';

import {
  WeatherApi_ForecastParams,
  WeatherApi_ForecastResult,
  WeatherApi_FutureParams,
  WeatherApi_HistoricalParams,
  WeatherApi_HistoricalResult,
  WeatherApi_WeatherCondition,
} from './types';

export class WeatherAPI {
  private static readonly BASE_URL = 'https://api.weatherapi.com/v1';
  private static readonly client = ky.create({
    prefixUrl: this.BASE_URL,
    searchParams: {
      key: ENV.WEATHER_API_KEY,
    },
  });
  private static readonly logger = Logger.getSubLogger({
    name: this.name,
  });

  static async getAllConditions() {
    // type Response = Array<{
    //   code: number;
    //   day: string;
    //   icon: number;
    //   night: string;
    // }>;

    const route = 'https://www.weatherapi.com/docs/conditions.json';
    const request = await ky.get(route);
    const result = await request.text();
    return result;
  }

  /**
   * The function retrieves the forecast weather data for a given set of coordinates.
   * @param {Coordinates} coordinates - The `coordinates` parameter is an object that represents the
   * latitude and longitude of a location. It typically has the following structure:
   * @returns a result of type WeatherApi_ForecastResult.
   */
  static async getForecastWeather(coordinates: Coordinates) {
    const route = 'forecast.json';
    const searchParams: WeatherApi_ForecastParams = {
      days: 10,
      q: getCoordinateString(coordinates),
    };

    const request = await this.client.get(route, { searchParams });
    this.logger.debug('forecast weather route=%o', request.url);
    const result = await request.json<WeatherApi_ForecastResult>();
    return result;
  }

  /**
   * The function `getFutureWeather` retrieves future weather forecast data based on given coordinates
   * and date.
   * @param {Coordinates} coordinates - The `coordinates` parameter is an object that represents the
   * latitude and longitude of a location. It typically has the following structure:
   * @param {Date} date - The `date` parameter is a `Date` object that represents the specific date for
   * which you want to retrieve the future weather forecast.
   * @returns a result of type WeatherApi_ForecastResult.
   */
  static async getFutureWeather(coordinates: Coordinates, date: Date) {
    const route = 'future.json';
    const searchParams: WeatherApi_FutureParams = {
      dt: moment(date).format('YYYY-MM-DD'),
      q: getCoordinateString(coordinates),
    };

    const request = await this.client.get(route, { searchParams });
    this.logger.debug('future weather route=%o', request.url);
    const result = await request.json<WeatherApi_ForecastResult>();
    return result;
  }

  /**
   * The function `getHistoricalWeather` retrieves historical weather data for a specific date and
   * location using the Weather API.
   * @param {Coordinates} coordinates - The `coordinates` parameter is an object that contains latitude
   * and longitude values. It is used to specify the location for which historical weather data is
   * requested.
   * @param {Date} date - The `date` parameter in the `getHistoricalWeather` function is of type
   * `Date`. It represents the specific date for which you want to retrieve historical weather data.
   * @returns a result of type WeatherApi_HistoricalResult.
   */
  static async getHistoricalWeather(coordinates: Coordinates, date: Date) {
    const route = 'history.json';
    const coordinatesStr = getCoordinateString(coordinates);
    const searchParams: WeatherApi_HistoricalParams = {
      dt: moment(date).format('YYYY-MM-DD'),
      q: coordinatesStr,
    };
    const request = await this.client.get(route, { searchParams });
    this.logger.debug('historical weather route=%o', request.url);
    const result = await request.json<WeatherApi_HistoricalResult>();
    return result;
  }

  /**
   * The function returns the URL of an icon based on a given weather condition.
   * @param {WeatherApi_WeatherCondition} condition - The parameter "condition" is of type
   * "WeatherApi_WeatherCondition".
   * @returns a formatted URL string for the icon of a given weather condition.
   */
  static getIconUrl(condition: WeatherApi_WeatherCondition) {
    return format('https:%s', condition.icon);
  }
}
