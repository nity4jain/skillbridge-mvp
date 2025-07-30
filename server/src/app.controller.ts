// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // ONLY KEEP AppService here

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}