// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { AiIntegrationModule } from './ai-integration/ai-integration.module'; // <<<--- ENSURE THIS IS IMPORTED
import { AnalysisController } from './analysis/analysis.controller';
// Import ConfigModule and TypeOrmModule related to your database setup
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module'; // Assuming you have a UserModule


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Assuming your ConfigModule is correctly setup for .env
    JobsModule,
    // AiIntegrationModule provides AiIntegrationService and HttpService (via HttpModule)
    AiIntegrationModule, // <<<--- AiIntegrationModule MUST be in the imports array here
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: parseInt(config.get<string>('DB_PORT') || '5432', 10),
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PASSWORD') || '',
            database: config.get<string>('DB_NAME'),
            autoLoadEntities: true, // Be careful with synchronize:true in prod
            synchronize: true, // Use migrations in production!
        }),
    }),
    UserModule, // Assuming you have this module
  ],
  controllers: [
    AppController,
    AnalysisController // <<<--- AnalysisController should be listed here
  ],
  providers: [
    AppService,
    // <<<--- IMPORTANT: DO NOT LIST AiIntegrationService here again.
    // It's provided by AiIntegrationModule, which is imported above.
    // If it's here, it can cause the dependency resolution to break.
  ],
})
export class AppModule {}