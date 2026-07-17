import { HttpClient } from '../../common/http/index.js';
import { OpenMeteoClient } from './open-meteo.client.js';
import { formatWeatherReport } from './weather.types.js';

export class WeatherService {
  private readonly openMeteoClient: OpenMeteoClient;

  constructor(httpClient: HttpClient) {
    this.openMeteoClient = new OpenMeteoClient(httpClient);
  }

  async queryWeather(city: string): Promise<string> {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      throw new Error('城市名不能为空');
    }

    const geocodingResponse = await this.openMeteoClient.geocode(trimmedCity);
    const location = geocodingResponse.results?.[0];
    if (!location) {
      throw new Error(`未找到城市：${trimmedCity}`);
    }

    const forecastResponse = await this.openMeteoClient.getForecast(
      location.latitude,
      location.longitude,
    );

    return formatWeatherReport(
      location.name,
      location.admin1,
      location.country,
      forecastResponse.current,
      forecastResponse.current_units,
    );
  }
}
