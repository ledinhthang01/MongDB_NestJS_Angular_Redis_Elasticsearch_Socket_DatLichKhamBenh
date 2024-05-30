import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        return new BadRequestException(Object.values(errors[0].constraints)[0]);
      },
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT, () => {
    console.log('Server listen on port', process.env.PORT);
  });
}
bootstrap();
