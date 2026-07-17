export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface CurrentWeather {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
}

export interface ForecastResponse {
  current: CurrentWeather;
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
  };
}

export const WEATHER_CODE_MAP: Record<number, string> = {
  0: '晴',
  1: '主要晴朗',
  2: '多云',
  3: '阴天',
  45: '雾',
  48: '雾凇',
  51: '毛毛雨（轻）',
  53: '毛毛雨（中）',
  55: '毛毛雨（密）',
  56: '冻雨（轻）',
  57: '冻雨（密）',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  66: '雨夹雪（轻）',
  67: '雨夹雪（重）',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '雪粒',
  80: '阵雨（轻）',
  81: '阵雨（中）',
  82: '阵雨（强）',
  85: '阵雪（轻）',
  86: '阵雪（强）',
  95: '雷雨',
  96: '雷雨伴冰雹（轻）',
  99: '雷雨伴冰雹（重）',
};

export function getWeatherDescription(code: number): string {
  return WEATHER_CODE_MAP[code] ?? '未知天气';
}

export function formatWeatherReport(
  city: string,
  region: string | undefined,
  country: string,
  current: CurrentWeather,
  units: ForecastResponse['current_units'],
): string {
  const location = region
    ? `${city}（${region}，${country}）`
    : `${city}（${country}）`;
  const description = getWeatherDescription(current.weather_code);

  return [
    `${location}当前天气：${description}`,
    `温度：${current.temperature_2m}${units.temperature_2m}`,
    `体感温度：${current.apparent_temperature}${units.apparent_temperature}`,
    `湿度：${current.relative_humidity_2m}${units.relative_humidity_2m}`,
    `风速：${current.wind_speed_10m}${units.wind_speed_10m}`,
  ].join('\n');
}
