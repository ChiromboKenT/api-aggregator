import { NestFactory } from '@nestjs/core';
import { RequestHandlerModule } from './request-handler.module';

async function bootstrap() {
  const app = await NestFactory.create(RequestHandlerModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
