// skillbridge-server/src/ai-integration/ai-integration.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // <<<--- IMPORTANT: Ensure this is imported from '@nestjs/axios'
import { AiIntegrationService } from './ai-integration.service';

@Module({
  imports: [
    HttpModule // <<<--- HttpModule MUST be imported here so AiIntegrationService can use HttpService
  ],
  providers: [AiIntegrationService], // AiIntegrationService is provided by THIS module
  exports: [AiIntegrationService],   // AiIntegrationService MUST be exported so AppModule can use it
})
export class AiIntegrationModule {}