import {
  Controller,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('jobs')
export class JobsController {
  private jobsData: any[];

  constructor() {
    try {
      // This works in both src (dev) and dist (prod)
      const jobsPath = path.resolve(__dirname, '../../data/jobs.json');

      if (!fs.existsSync(jobsPath)) {
        console.error('jobs.json not found at:', jobsPath);
        throw new Error('jobs.json file not found.');
      }

      const rawData = fs.readFileSync(jobsPath, 'utf8');
      this.jobsData = JSON.parse(rawData);
      console.log(`Loaded ${this.jobsData.length} jobs from jobs.json`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(' Error loading jobs.json:', error.message);
      } else {
        console.error(' Error loading jobs.json:', error);
      }
      this.jobsData = [];
      throw new InternalServerErrorException('Failed to load job data.');
    }
  }

  @Get()
  findAll(): any[] {
    return this.jobsData;
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    const job = this.jobsData.find((j) => j.id === id);
    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found.`);
    }
    return job;
  }
}
