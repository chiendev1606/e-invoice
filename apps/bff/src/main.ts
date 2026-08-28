/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CONFIGURATION } from './configuration';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = CONFIGURATION.APP_CONFIG.GLOBAL_PREFIX;
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.enableCors({ origin: '*' });

    const config = new DocumentBuilder()
      .setTitle('BFF API')
      .setDescription('The BFF API description')
      .setVersion('1.0.0')
      .addBearerAuth({
        description: 'Default authorization header',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
      })
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory());

    const port = CONFIGURATION.APP_CONFIG.PORT;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`🚀 Swagger is running on: http://localhost:${port}/${globalPrefix}/docs`);
  } catch (error) {
    Logger.error('❌ Application failed to start', error, 'Bootstrap', false);
  }
}

bootstrap();
