import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { StreamingModule } from './streaming.module';
import { AuthModule } from '../auth/auth.module';
import { LiveStreamModule } from './live-stream.module';
import { databaseConfig, appConfig } from '../config';

@Module({
  imports: [
    // Configuration module - must be first
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    // TypeORM module with async configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
      inject: [ConfigService],
    }),
    // Feature modules
    AuthModule,
    StreamingModule,
    LiveStreamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
