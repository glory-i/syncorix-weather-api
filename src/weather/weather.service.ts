import { BadRequestException, Injectable  } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as process from 'process';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { WeatherHistoryResponseDto } from './dto/weather-history-response.dto';
import { CityWeatherResponseDto } from './dto/weather-city-response.dto';
import { WeatherFutureResponseDto } from './dto/weather-future-response.dto';
import { ResponseCode, ResponseMessage } from '../common/enums/response-code.enum';
import { BaseDataResponseDto } from '../common/dto/base-data-response.dto';




@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  async getWeatherByCountry(country: string) : Promise<BaseDataResponseDto<WeatherResponseDto>> {

    try
    {
        //get variables from env file
        const apiKey = process.env.WEATHER_API_KEY;
        const baseUrl = process.env.WEATHER_API_URL;
    
        //build the endpoint url
        const endpointUrl  = baseUrl + "/v1/current.json"
    
        //make api call to endpoint, and deserialze the response into json
        const response = await firstValueFrom(
          this.httpService.get<WeatherResponseDto>(endpointUrl, {
            params: {
              q: country,
              key: apiKey,
            },
            validateStatus: () => true
          }),
        );
    
        if(response.data.error != null)
        {
            //if error is returned, return the error
            return {
                responseCode: response.data.error.code ?? ResponseCode.ERROR,
                responseMessage:  response.data.error.message ?? ResponseMessage.ERROR,
                data: null,
              };
        }
    
        //otherwise return the successful result.
        return {
            responseCode: ResponseCode.SUCCESS,
            responseMessage: ResponseMessage.SUCCESS,
            data: response.data,
          };

    }
    catch(error)
    {
        console.error('Error fetching weather data:', error?.message || error);
        return {
            responseCode: ResponseCode.ERROR,
            responseMessage: 'Error retrieving weather data ' + (error?.message || error), 
            data: null,
          };

    }

  }


  async getPreviousWeather(weatherDate: string, country:string) : Promise<BaseDataResponseDto<WeatherHistoryResponseDto>> {
    try
    {
        //get variables from env file
        const apiKey = process.env.WEATHER_API_KEY;
        const baseUrl = process.env.WEATHER_API_URL;
    
        //build the endpoint url
        const endpointUrl  = baseUrl + "/v1/history.json"
    
        //make api call to endpoint, and deserialze the response into json
        const response = await firstValueFrom(
          this.httpService.get<WeatherHistoryResponseDto>(endpointUrl, {
            params: {
              q: country,
              dt: weatherDate,
              key: apiKey,
            },
            validateStatus: () => true
          }),
        );
    
        if(response.data.error != null)
        {
            //if error is returned, return the error
            return {
                responseCode: response.data.error.code ?? ResponseCode.ERROR,
                responseMessage:  response.data.error.message ?? ResponseMessage.ERROR,
                data: null,
              };
        }
    
        //otherwise return the successful result.
        return {
            responseCode: ResponseCode.SUCCESS,
            responseMessage: ResponseMessage.SUCCESS,
            data: response.data,
          };

    }
    catch(error)
    {
        console.error('Error fetching weather data:', error?.message || error);
        return {
            responseCode: ResponseCode.ERROR,
            responseMessage: 'Error retrieving weather data ' + (error?.message || error), 
            data: null,
          };

    }

  }


  async getFutureWeather(weatherDate: string, country:string) : Promise<BaseDataResponseDto<WeatherFutureResponseDto>> {
    try
    {
        //get variables from env file
        const apiKey = process.env.WEATHER_API_KEY;
        const baseUrl = process.env.WEATHER_API_URL;
    
        //build the endpoint url
        const endpointUrl  = baseUrl + "/v1/forecast.json"
    
        //make api call to endpoint, and deserialze the response into json
        const response = await firstValueFrom(
          this.httpService.get<WeatherFutureResponseDto>(endpointUrl, {
            params: {
              q: country,
              dt: weatherDate,
              key: apiKey,
            },
            validateStatus: () => true
          }),
        );
    
        if(response.data.error != null)
        {
            //if error is returned, return the error
            return {
                responseCode: response.data.error.code ?? ResponseCode.ERROR,
                responseMessage:  response.data.error.message ?? ResponseMessage.ERROR,
                data: null,
              };
        }
    
        //otherwise return the successful result.
        return {
            responseCode: ResponseCode.SUCCESS,
            responseMessage: ResponseMessage.SUCCESS,
            data: response.data,
          };

    }
    catch(error)
    {
        console.error('Error fetching weather data:', error?.message || error);
        return {
            responseCode: ResponseCode.ERROR,
            responseMessage: 'Error retrieving weather data ' + (error?.message || error), 
            data: null,
          };

    }

  }




  
  async getWeatherPopular(): Promise<BaseDataResponseDto<WeatherResponseDto[]>> {
    
    //hardocded list of popular cities
    const cities = ['Madeira', 'Manchester', 'Madrid', 'Turin', 'Saudi Arabia'];

    //initialise empty array
    const results: WeatherResponseDto[] = [];

    //get weather results for each city
    for (const city of cities) {
      try
      {
        const weather = await this.getWeatherByCountry(city);
        if(weather.data != null)
        {
          results.push(weather.data);
        }

      } 
      catch (error) 
      {
        console.error(`Error processing city ${city}`, error?.message);
        
        return {
          responseCode: ResponseCode.ERROR,
          responseMessage: `Error processing city ${city} ` +  (error?.message),
          data: null,
        };
      }
    }

    return {
      responseCode: ResponseCode.SUCCESS,
      responseMessage: ResponseMessage.SUCCESS,
      data: results,
    };

  }


  async getCityWeather(cityName : string): Promise<BaseDataResponseDto<CityWeatherResponseDto>> {
    
    try
    {
          //get current wether
          const currentWeather = await this.getWeatherByCountry(cityName);

          if(currentWeather.data?.error != null)
          {
            return {
                responseCode: currentWeather.data.error.code ?? ResponseCode.ERROR,
                responseMessage:  currentWeather.data.error.message ?? ResponseMessage.ERROR,
                data: null,
              };
          }

          //get tomorrow weather
          const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const tomorrowWeather = await this.getFutureWeather(tomorrowDate,cityName);

          if(tomorrowWeather.data?.error != null)
          {
            return {
                responseCode: tomorrowWeather.data.error.code ?? ResponseCode.ERROR,
                responseMessage:  tomorrowWeather.data.error.message ?? ResponseMessage.ERROR,
                data: null,
              };
          }

          //get yesetrday weather
          const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const yesterdayWeather = await this.getPreviousWeather(yesterdayDate,cityName);
          
          if(yesterdayWeather.data?.error != null)
          {
            return {
                responseCode: yesterdayWeather.data.error.code ?? ResponseCode.ERROR,
                responseMessage:  yesterdayWeather.data.error.message ?? ResponseMessage.ERROR,
                data: null,
              };
          }
          
          
          //comnine result of current previous and future weather, using the json format specified.
          const resultingWeather: CityWeatherResponseDto = {
          city: cityName,
          weather: {
              yesterday: yesterdayWeather.data?.forecast?.forecastday?.[0]?.day ?? null,
              today: currentWeather.data?.current ?? null,
              tomorrow: tomorrowWeather.data?.forecast?.forecastday?.[0]?.day ?? null
            },
            error : null
          }

          //return result
          return {
            responseCode: ResponseCode.SUCCESS,
            responseMessage: ResponseMessage.SUCCESS,
            data: resultingWeather,
          };

    }
    catch(error)
    {
        console.error('Error fetching weather data:', error?.message || error);
        return {
            responseCode: ResponseCode.ERROR,
            responseMessage: 'Error retrieving weather data ' + (error?.message || error), 
            data: null,
          };

    }


    

  

  }



}


