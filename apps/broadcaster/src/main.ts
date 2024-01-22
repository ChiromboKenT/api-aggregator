import { NestFactory } from '@nestjs/core';
import { BroadcasterModule } from './broadcaster.module';

async function bootstrap() {
  const app = await NestFactory.create(BroadcasterModule);
  await app.listen(3000);
}
bootstrap();
