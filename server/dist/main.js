"use strict";
// skillbridge-server/src/main.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common"); // Import INestApplication
const swagger_1 = require("@nestjs/swagger");
const express = __importStar(require("express"));
const path_1 = require("path");
// Function to setup Swagger document (it creates the document, doesn't serve it yet)
function createSwaggerDocument(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SkillBridge API')
        .setDescription('API documentation for the SkillBridge backend')
        .setVersion('1.0')
        .addTag('analysis', 'Endpoints for AI-powered resume and profile analysis')
        .addTag('jobs', 'Endpoints for managing job listings')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    return document; // Return the document
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    const customSwaggerAssetsPath = (0, path_1.join)(__dirname, '..', 'src', 'swagger-assets');
    const swaggerUiDistPath = (0, path_1.join)(__dirname, '..', 'node_modules', 'swagger-ui-dist');
    // Serve your custom index.html and swagger-initializer.js (which points to /api/docs-json)
    expressApp.use('/api/docs', express.static(customSwaggerAssetsPath, { index: 'index.html' }));
    // Serve the core swagger-ui-dist files (bundle.js, preset.js, css, favicons)
    expressApp.use('/api/docs', express.static(swaggerUiDistPath));
    // --- NEW CRITICAL PART: EXPLICITLY SERVE THE SWAGGER JSON DEFINITION ---
    const swaggerDocument = createSwaggerDocument(app); // Create the document
    expressApp.get('/api/docs-json', (req, res) => {
        res.json(swaggerDocument); // Serve the generated JSON
    });
    // --- END NEW CRITICAL PART ---
    // REMOVED: SwaggerModule.setup('docs', app, document); // This line is now removed
    // 4. Start the application listener
    const PORT = process.env.PORT || 5000;
    await app.listen(PORT, () => {
        common_1.Logger.log(`NestJS application is running on: http://localhost:${PORT}/api`);
        common_1.Logger.log(`Swagger UI available at: http://localhost:${PORT}/api/docs`); // UI is here
        common_1.Logger.log(`Swagger JSON definition available at: http://localhost:${PORT}/api/docs-json`); // Raw JSON is here
    });
}
bootstrap();
