// skillbridge-server/src/analysis/analysis.controller.ts

import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiIntegrationService } from '../ai-integration/ai-integration.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger'; // Ensure these are imported

// Define the DTO for text analysis requests
class AnalyzeTextDto {
  content?: string; // Made optional to avoid TS2564: Property has no initializer
}

@Controller('analysis')
export class AnalysisController {
  private readonly logger = new Logger(AnalysisController.name);

  constructor(private readonly aiIntegrationService: AiIntegrationService) {}

  @Post('text')
  async analyzeText(@Body() analyzeTextDto: AnalyzeTextDto) {
    this.logger.log('Received request for text analysis.');
    if (!analyzeTextDto.content || analyzeTextDto.content.trim() === '') {
      this.logger.warn('Text analysis request: Content is empty.');
      throw new HttpException('Content cannot be empty', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.aiIntegrationService.analyzeProfileText(analyzeTextDto.content);
      this.logger.log('Text analysis successful, returning results.');
      // TODO: Save result to your PostgreSQL database here
      return result;
    } catch (error: unknown) { // Explicitly type caught error as unknown
      this.logger.error(
        `Error during text analysis: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      throw new HttpException(error instanceof Error ? error.message : 'An unknown error occurred.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('file-upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' matches the field name in form-data
  @ApiConsumes('multipart/form-data') // For Swagger UI documentation
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Indicates a file upload in Swagger
          description: 'Resume file (PDF or DOCX)',
        },
      },
      required: ['file']
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) { // `Express.Multer.File` should resolve with `import { Request } from 'express'`
    this.logger.log('Received request for file upload analysis.');
    if (!file) {
      this.logger.warn('File upload request: No file provided.');
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // for .docx
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      this.logger.warn(`File upload request: Unsupported file type - ${file.mimetype}`);
      throw new HttpException('Unsupported file type. Only PDF and DOCX are allowed.', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.aiIntegrationService.uploadResumeFile(file);
      this.logger.log('File upload analysis successful, returning results.');
      // TODO: Save result to your PostgreSQL database here
      return result;
    } catch (error: unknown) {
      this.logger.error(
        `Error during file upload analysis: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      throw new HttpException(error instanceof Error ? error.message : 'An unknown error occurred.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}