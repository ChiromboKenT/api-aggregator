import { NestFactory } from '@nestjs/core';
import { Listener } from './listener';
import { BroadcasterModule } from './broadcaster.module';

async function bootstrap() {
  const app = await NestFactory.create(BroadcasterModule);
  const listener = app.get(Listener);

  listener.start();
  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
