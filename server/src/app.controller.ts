import { Controller, Get, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('api')
export class AppController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('jobs')
  async getScrapedJobs(@Query('q') q: string = 'frontend developer') {
    return await this.jobsService.fetchJobsFromSerpAPI(q);
  }
}