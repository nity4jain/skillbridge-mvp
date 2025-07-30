// skillbridge-server/src/jobs/jobs.module.ts

import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
// import { JobsService } from './jobs.service'; // Uncomment if you create a service

@Module({
  controllers: [JobsController],
  // providers: [], // No JobsService available
  // exports: [], // No JobsService to export
})
export class JobsModule {}