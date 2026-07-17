import { HttpClient } from '../../common/http/index.js';
import type { GeocodingResponse, ForecastResponse } from './weather.types.js';

export class OpenMeteoClient {
  constructor(private readonly httpClient: HttpClient) {}

  async geocode(city: string): Promise<GeocodingResponse> {
    const encoded = encodeURIComponent(city.trim());
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=1&language=en&format=json`;
    return this.httpClient.get<GeocodingResponse>(
      url,
      { timeout: 10000 },
      '查询城市地理位置失败',
    );
  }

  async getForecast(
    latitude: number,
    longitude: number,
  ): Promise<ForecastResponse> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
      timezone: 'auto',
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    return this.httpClient.get<ForecastResponse>(
      url,
      { timeout: 10000 },
      '查询天气数据失败',
    );
  }
}
