import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('error')
  getError(): string {
    throw new NotFoundException('This is an error message');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
