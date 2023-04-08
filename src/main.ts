import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { Connection } from 'mongoose'

import { env } from 'process';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: 'v1',
    prefix: '',
  });

  const config = new DocumentBuilder()
    .setTitle('Api Docs')
    .setVersion('1.0')
    .setDescription('')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.PORT, () =>
    console.log(`App running on port ${env.PORT}`),
  );
}
bootstrap();
