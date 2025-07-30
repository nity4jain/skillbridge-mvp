// skillbridge-server/src/ai-integration/ai-integration.service.ts

/// <reference types="node" /> // Ensure Node.js global types are available (e.g., Buffer)
/// <reference types="express" /> // Ensure Express global types are available (e.g., Express.Multer.File)
/// <reference types="multer" />  // Ensure Multer global types are available

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
// REMOVED: import { isAxiosError } from 'axios';
// REMOVED: import type { AxiosError } from 'axios';
// ADDED: No direct axios import for these anymore to avoid compilation error

// --- Custom Type Declaration for AxiosError ---
// This interface explicitly defines the shape of an AxiosError for TypeScript.
// We are creating this manually because the compiler cannot find it from 'axios'.
interface IAxiosError extends Error {
  config?: any; // Add properties you expect from AxiosError
  code?: string;
  request?: any;
  response?: {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config?: any;
    request?: any;
  };
  isAxiosError: boolean; // Crucial property that isAxiosError checks for
  toJSON: () => object;
}

// --- Custom Type Guard for isAxiosError ---
// This function checks if an unknown error object conforms to the IAxiosError interface.
// We are creating this manually because the compiler cannot find 'isAxiosError' from 'axios'.
function isAxiosErrorGuard(error: unknown): error is IAxiosError {
  return (typeof error === 'object' && error !== null && (error as IAxiosError).isAxiosError === true);
}

@Injectable()
export class AiIntegrationService {
  private readonly aiServiceUrl = 'http://localhost:8001'; // Your Python AI service URL
  private readonly logger = new Logger(AiIntegrationService.name);

  constructor(private readonly httpService: HttpService) {}

  async analyzeProfileText(content: string): Promise<any> {
    try {
      this.logger.log(`Calling AI service for text analysis: ${this.aiServiceUrl}/analyze-profile/`);
      const response = await lastValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/analyze-profile/`, { content })
      );
      this.logger.log('AI service text analysis successful.');
      return response.data;
    } catch (error: unknown) { // Catch error as unknown
      if (isAxiosErrorGuard(error)) { // Use our custom type guard
        // Now, 'error' is treated as IAxiosError within this block
        this.logger.error(`AI service text analysis failed: ${error.message}`, error.stack);
        this.logger.error('AI Service Response:', error.response?.data);
        throw new Error(`AI analysis failed: ${error.response?.data?.detail || error.message}`);
      }
      // Handle non-Axios errors or general errors
      this.logger.error(
        `Unknown error during AI text analysis: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined // stack might not exist
      );
      throw new Error('An unexpected error occurred during AI text analysis.');
    }
  }

  async uploadResumeFile(file: Express.Multer.File): Promise<any> {
    try {
      this.logger.log(`Calling AI service for file upload: ${this.aiServiceUrl}/upload-resume-file/`);

      const formData = new FormData();
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append('file', blob, file.originalname);

      const response = await fetch(`${this.aiServiceUrl}/upload-resume-file/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`AI service file upload failed with status ${response.status}: ${errorBody}`);
        throw new Error(`AI file analysis failed: ${errorBody}`);
      }

      const data = await response.json();
      this.logger.log('AI service file analysis successful.');
      return data;

    } catch (error: unknown) {
      this.logger.error(
        `Error during AI file upload: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      throw new Error('An unexpected error occurred during AI file analysis.');
    }
  }
}