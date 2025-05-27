import { WeatherError } from './weather-response.dto';
import { Current } from './weather-response.dto';
import { Forecastday } from './weather-history-response.dto';
import { Day } from './weather-history-response.dto';


export interface CityWeatherResponseDto
{
  city: string
  weather: CityWeather
  error: WeatherError | null
}

export interface CityWeather
{
  yesterday: Day | null
  today: Current | null
  tomorrow: Day | null
}

