import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule], 
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}