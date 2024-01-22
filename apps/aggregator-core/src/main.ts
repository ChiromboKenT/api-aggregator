import { NestFactory } from '@nestjs/core';
import { AggregatorCoreModule } from './app.module';
import { Listener } from './listener';

async function bootstrap() {
  const app = await NestFactory.create(AggregatorCoreModule);
  const listener = app.get(Listener);

  listener.start();
  await app.listen(process.env.APP_PORT || 3002);
}

bootstrap();
