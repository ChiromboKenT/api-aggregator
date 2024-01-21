import { NestFactory } from '@nestjs/core';
import { ExternalApiHandlerModule } from './app.module';
import { Listener } from './listener';

async function bootstrap() {
  const app = await NestFactory.create(ExternalApiHandlerModule);
  const listener = app.get(Listener);

  listener.start();
  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
