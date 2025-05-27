import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';


@ApiTags('App') // for grouping endpoints in Swagger
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'hello world' })
  getHello(): string {
    return this.appService.getHello();
  }
}
