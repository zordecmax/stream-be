import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Get configuration
  // const port = configService.get<number>('app.port') || 3000;
  const appPortFromConfig = configService.get<number>('app.port');

  const port = process.env.PORT || appPortFromConfig || 3000;
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

  // Setup Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Streaming Service API')
    .setDescription(
      'Backend API for streaming service with VOD content and live streaming support',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('streaming', 'VOD content management')
    .addTag('live-streams', 'Live streaming with Mux')
    .addTag('users', 'User management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name will be used in controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port, '0.0.0.0');
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  logger.log(
    `📚 API documentation available at: http://localhost:${port}/${apiPrefix}/docs`,
  );
}

void bootstrap();
