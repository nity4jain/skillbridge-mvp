"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
// src/app.module.ts
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const jobs_module_1 = require("./jobs/jobs.module");
const ai_integration_module_1 = require("./ai-integration/ai-integration.module"); // <<<--- ENSURE THIS IS IMPORTED
const analysis_controller_1 = require("./analysis/analysis.controller");
// Import ConfigModule and TypeOrmModule related to your database setup
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module"); // Assuming you have a UserModule
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }), // Assuming your ConfigModule is correctly setup for .env
            jobs_module_1.JobsModule,
            // AiIntegrationModule provides AiIntegrationService and HttpService (via HttpModule)
            ai_integration_module_1.AiIntegrationModule, // <<<--- AiIntegrationModule MUST be in the imports array here
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST'),
                    port: parseInt(config.get('DB_PORT') || '5432', 10),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD') || '',
                    database: config.get('DB_NAME'),
                    autoLoadEntities: true, // Be careful with synchronize:true in prod
                    synchronize: true, // Use migrations in production!
                }),
            }),
            user_module_1.UserModule, // Assuming you have this module
        ],
        controllers: [
            app_controller_1.AppController,
            analysis_controller_1.AnalysisController // <<<--- AnalysisController should be listed here
        ],
        providers: [
            app_service_1.AppService,
            // <<<--- IMPORTANT: DO NOT LIST AiIntegrationService here again.
            // It's provided by AiIntegrationModule, which is imported above.
            // If it's here, it can cause the dependency resolution to break.
        ],
    })
], AppModule);
