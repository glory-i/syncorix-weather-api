//unit test for weather controller
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { BaseDataResponseDto } from 'src/common/dto/base-data-response.dto';
import { CityWeatherResponseDto } from './dto/weather-city-response.dto';
import { WeatherResponseDto } from './dto/weather-response.dto';


describe('WeatherController', () => {
  let controller: WeatherController;
  let service: WeatherService;

  beforeEach(async () => {
    //mock the weather service endpoint
    const mockWeatherService = {
      getWeatherByCountry: jest.fn(), 
      getCityWeather: jest.fn(), 
    };



    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    service = module.get<WeatherService>(WeatherService);
  });


  //unit test for the endpoint for current weather for a city/country

  it('should return weather data for given country', async () => {
    // Arrange
    const mockResponse: BaseDataResponseDto<WeatherResponseDto> = {
    responseCode: '200',
    responseMessage: 'SUCCESS',
    data: {
    location: {
        name: "Abuja",
        region: "Federal Capital Territory",
        country: "Nigeria",
        lat: 9.176,
        lon: 7.181,
        tz_id: "Africa/Lagos",
        localtime_epoch: 1748430651,
        localtime: "2025-05-28 12:10",
    },
    current: {
        last_updated_epoch: 1748430000,
        last_updated: "2025-05-28 12:00",
        temp_c: 34.9,
        temp_f: 94.8,
        is_day: 1,
        condition: {
        text: "Partly Cloudy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: 1003,
        },
        wind_mph: 5.4,
        wind_kph: 8.6,
        wind_degree: 213,
        wind_dir: "SSW",
        pressure_mb: 1013.0,
        pressure_in: 29.92,
        precip_mm: 0.0,
        precip_in: 0.0,
        humidity: 41,
        cloud: 46,
        feelslike_c: 37.9,
        feelslike_f: 100.3,
        windchill_c: 34.9,
        windchill_f: 94.7,
        heatindex_c: 37.9,
        heatindex_f: 100.3,
        dewpoint_c: 19.6,
        dewpoint_f: 67.2,
        vis_km: 10.0,
        vis_miles: 6.0,
        uv: 7.0,
        gust_mph: 6.2,
        gust_kph: 9.9,
    },
        error: null,
        }
    };


    (service.getWeatherByCountry as jest.Mock).mockResolvedValue(mockResponse);

    // Act
    const result = await controller.getWeather('Nigeria');

    // Assert
    expect(result).toEqual(mockResponse);
    expect(service.getWeatherByCountry).toHaveBeenCalledWith('Nigeria');
  });


  //unit test for the endpoint for future current and previous weather for a city

  it('should return previous, current and historic weather of a city.', async () => {
    // Arrange
    const weatherCityResponse : BaseDataResponseDto<CityWeatherResponseDto> = {
          responseCode: "200",
          responseMessage: "SUCCESS",
          data: {
            city: "London",
            weather: {
              yesterday: {
                maxtemp_c: 18,
                maxtemp_f: 64.3,
                mintemp_c: 12.5,
                mintemp_f: 54.5,
                avgtemp_c: 14.3,
                avgtemp_f: 57.8,
                maxwind_mph: 18.6,
                maxwind_kph: 29.9,
                totalprecip_mm: 6.5,
                totalprecip_in: 0.26,
                totalsnow_cm: 0,
                avgvis_km: 8.6,
                avgvis_miles: 5,
                avghumidity: 84,
                daily_will_it_rain: 1,
                daily_chance_of_rain: 100,
                daily_will_it_snow: 0,
                daily_chance_of_snow: 0,
                condition: {
                  text: "Light rain",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/296.png",
                  code: 1183
                },
                uv: 4
              },
              today: {
                last_updated_epoch: 1748432700,
                last_updated: "2025-05-28 12:45",
                temp_c: 17.1,
                temp_f: 62.8,
                is_day: 1,
                condition: {
                  text: "Partly cloudy",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                  code: 1003
                },
                wind_mph: 13,
                wind_kph: 20.9,
                wind_degree: 281,
                wind_dir: "WNW",
                pressure_mb: 1016,
                pressure_in: 30,
                precip_mm: 0.02,
                precip_in: 0,
                humidity: 55,
                cloud: 50,
                feelslike_c: 17.1,
                feelslike_f: 62.8,
                windchill_c: 17,
                windchill_f: 62.5,
                heatindex_c: 17,
                heatindex_f: 62.5,
                dewpoint_c: 8.1,
                dewpoint_f: 46.7,
                vis_km: 10,
                vis_miles: 6,
                uv: 3.4,
                gust_mph: 14.9,
                gust_kph: 24
              },
              tomorrow: {
                maxtemp_c: 23.2,
                maxtemp_f: 73.8,
                mintemp_c: 12.9,
                mintemp_f: 55.3,
                avgtemp_c: 17.8,
                avgtemp_f: 64.1,
                maxwind_mph: 15,
                maxwind_kph: 24.1,
                totalprecip_mm: 0.17,
                totalprecip_in: 0.01,
                totalsnow_cm: 0,
                avgvis_km: 10,
                avgvis_miles: 6,
                avghumidity: 72,
                daily_will_it_rain: 1,
                daily_chance_of_rain: 89,
                daily_will_it_snow: 0,
                daily_chance_of_snow: 0,
                condition: {
                  text: "Patchy rain nearby",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
                  code: 1063
                },
                uv: 1.1
              }
            },
            error: null
          }
};


    (service.getCityWeather as jest.Mock).mockResolvedValue(weatherCityResponse);

    // Act
    const result = await controller.getWeatherByCity('London');

    // Assert
    expect(result).toEqual(weatherCityResponse);
    expect(service.getCityWeather).toHaveBeenCalledWith('London');
  });


});


