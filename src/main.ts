import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Get configuration
  const port = configService.get<number>('app.port') || 3000;
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  const corsEnabled = configService.get<boolean>('app.corsEnabled');

  // Enable CORS if configured
  if (corsEnabled) {
    app.enableCors();
    logger.log('CORS enabled');
  }

  // Set global API prefix
  app.setGlobalPrefix(apiPrefix);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  logger.log(
    `📚 API documentation available at: http://localhost:${port}/${apiPrefix}/docs`,
  );
}

void bootstrap();
