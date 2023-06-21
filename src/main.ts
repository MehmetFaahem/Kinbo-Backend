import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import configuration from './config/configuration';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  const config = configuration.call(this);
  const appVersion = '/api';

  const builder = new DocumentBuilder()
    .setTitle('MEdi REST API')
    .setDescription('Medi REST API')
    .setVersion('1.0')
    .addServer(appVersion)
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup(appVersion + '/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        if (validationErrors[0].children.length)
          return new BadRequestException(
            Object.values(validationErrors[0].children[0].constraints)[0],
          );
        else
          return new BadRequestException(
            Object.values(validationErrors[0].constraints)[0],
          );
      },
    }),
  );

  app.setGlobalPrefix(appVersion);

  const port = config.port || 3000;
  await app.listen(port);
  Logger.log(port, 'AppsRunningPort');
}
bootstrap();
