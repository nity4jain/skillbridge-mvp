import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JobsService {
  private readonly apiKey = 'd763ac29cd6b3671a3444cf9d81663886cf32f3b0ab8be209379c14425236d80'; 

  async fetchJobsFromSerpAPI(query: string = 'frontend developer'): Promise<any[]> {
    const url = 'https://serpapi.com/search.json';

    try {
      const res = await axios.get(url, {
        params: {
          q: query,
          engine: 'google_jobs',
          api_key: this.apiKey
        }
      });

      const data = res.data as { jobs_results?: any[] };
      return data.jobs_results || [];
    } catch (err) {
      console.error('Failed to fetch from SerpAPI:', err);
      return [];
    }
  }
}
