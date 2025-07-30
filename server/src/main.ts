// skillbridge-server/src/main.ts

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, INestApplication } from '@nestjs/common'; // Import INestApplication
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

// Function to setup Swagger document (it creates the document, doesn't serve it yet)
function createSwaggerDocument(app: INestApplication): any {
  const config = new DocumentBuilder()
    .setTitle('SkillBridge API')
    .setDescription('API documentation for the SkillBridge backend')
    .setVersion('1.0')
    .addTag('analysis', 'Endpoints for AI-powered resume and profile analysis')
    .addTag('jobs', 'Endpoints for managing job listings')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  return document; // Return the document
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configure CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8001',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Set Global API Prefix
  app.setGlobalPrefix('api');

  // --- CRITICAL: Explicitly serve ALL Swagger UI static assets ---
  const expressApp = app.getHttpAdapter().getInstance(); // Get underlying Express app instance

  const customSwaggerAssetsPath = join(__dirname, '..', 'src', 'swagger-assets');
  const swaggerUiDistPath = join(__dirname, '..', 'node_modules', 'swagger-ui-dist');

  // Serve your custom index.html and swagger-initializer.js (which points to /api/docs-json)
  expressApp.use('/api/docs', express.static(customSwaggerAssetsPath, { index: 'index.html' }));

  // Serve the core swagger-ui-dist files (bundle.js, preset.js, css, favicons)
  expressApp.use('/api/docs', express.static(swaggerUiDistPath));


  // --- NEW CRITICAL PART: EXPLICITLY SERVE THE SWAGGER JSON DEFINITION ---
  const swaggerDocument = createSwaggerDocument(app); // Create the document
  interface SwaggerRequest extends express.Request {}
  interface SwaggerResponse extends express.Response {}

  expressApp.get('/api/docs-json', (req: SwaggerRequest, res: SwaggerResponse) => { // Manually create a GET route for the JSON
    res.json(swaggerDocument); // Serve the generated JSON
  });
  // --- END NEW CRITICAL PART ---

  // REMOVED: SwaggerModule.setup('docs', app, document); // This line is now removed

  // 4. Start the application listener
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => {
    Logger.log(`NestJS application is running on: http://localhost:${PORT}/api`);
    Logger.log(`Swagger UI available at: http://localhost:${PORT}/api/docs`); // UI is here
    Logger.log(`Swagger JSON definition available at: http://localhost:${PORT}/api/docs-json`); // Raw JSON is here
  });
}

bootstrap();