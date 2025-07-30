// skillbridge-server/src/app.service.ts

import { Injectable } from '@nestjs/common';

@Injectable() // This decorator makes the class injectable into other parts of NestJS
export class AppService {
  getHello(): string {
    return 'Hello from AppService!';
  }
}