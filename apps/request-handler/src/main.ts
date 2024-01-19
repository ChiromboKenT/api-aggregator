import { NestFactory } from '@nestjs/core';
import { RequestHandlerModule } from './request-handler.module';

async function bootstrap() {
  const app = await NestFactory.create(RequestHandlerModule);
  await app.listen(3000);
}
bootstrap();
