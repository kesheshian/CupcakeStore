import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as YAML from 'js-yaml';
import * as fs from 'fs';

async function bootstrap() {
  // Set up HTTPS
  const httpsOptions: HttpsOptions = {
    key: fs.readFileSync('https/server.key'),
    cert: fs.readFileSync('https/server.cert'),
  };

  const app = await NestFactory.create(AppModule, { cors: true , httpsOptions });

  // Set a global route prefix
  app.setGlobalPrefix('v2');

  // Enable the shutdown hooks
  app.enableShutdownHooks();

  // Load and parse the OpenAPI schema
  const openAPIDocument = YAML.load(fs.readFileSync('./schemas/cupcake_storev1.yml', 'utf8'));

  // Set up Swagger with the loaded document
  SwaggerModule.setup('api', app, openAPIDocument);

  await app.listen(3000);
}

bootstrap();
