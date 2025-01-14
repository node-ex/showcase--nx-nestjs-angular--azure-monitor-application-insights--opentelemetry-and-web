/*
 * Needed for setting up Application Insights.
 * Should have the same version as `@nestjs/config` package's dependency.
 */
import 'dotenv/config';
/* Must be the imported before other imports */
import './app/application-insights.setup';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  // console.log(process.env['GREETING']);

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const port = Number(process.env['PORT']) || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port.toString()}/${globalPrefix}`,
  );
}

void bootstrap();
