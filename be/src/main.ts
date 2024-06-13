import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        return new BadRequestException(Object.values(errors[0].constraints)[0]);
      },
      whitelist: true,
    }),
  );

  app.useStaticAssets(path.join(__dirname, '../uploads'));

  app.enableCors({
    // origin: '*',
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(process.env.PORT, () => {
    console.log('Server listen on port', process.env.PORT);
  });
}
bootstrap();
