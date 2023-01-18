import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors();
  app.use(cookieParser());
  // app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.setGlobalPrefix('/v1/api');
  await app.listen(port, () => console.log('server running at port %d', port));
}
bootstrap();
