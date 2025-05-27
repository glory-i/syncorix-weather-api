import { Controller, Get, Query, Param  } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { CityWeatherResponseDto } from './dto/weather-city-response.dto';
import { ApiOperation ,ApiQuery, ApiTags, ApiParam } from '@nestjs/swagger';
import { BaseDataResponseDto } from 'src/common/dto/base-data-response.dto';


@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/search')
  @ApiOperation({ summary: 'Get weather by country' })
  @ApiQuery({ name: 'country', required: true })
  async getWeather(@Query('country') country: string): Promise<BaseDataResponseDto<WeatherResponseDto>> {
    return this.weatherService.getWeatherByCountry(country);
  }


  @Get('/popular')
  @ApiOperation({ summary: 'Get weather of popular cities/countries' })
  async getWeatherPopular(): Promise<BaseDataResponseDto<WeatherResponseDto[]>> {
    return this.weatherService.getWeatherPopular();
  }

  @Get('/:city')
@ApiOperation({ summary: 'Get previous current future weather' })
@ApiParam({ name: 'city', type: String, description: 'Name of the city' })
async getWeatherByCity( @Param('city') city: string,): Promise<BaseDataResponseDto<CityWeatherResponseDto>> {
  return this.weatherService.getCityWeather(city);
}

}
