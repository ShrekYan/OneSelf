import { HttpClient } from '../../common/http/index.js';
import { WeatherService } from './weather.service.js';

const httpClient = new HttpClient();
const weatherService = new WeatherService(httpClient);

export async function queryWeather(city: string): Promise<string> {
  return weatherService.queryWeather(city);
}
