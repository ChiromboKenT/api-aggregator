import { NestFactory } from '@nestjs/core';
import { RequestHandlerModule } from './request-handler.module';
import { RequestHandlerService } from './request-handler.service';

async function bootstrap() {
  const app = await NestFactory.create(RequestHandlerModule);
  const listener = app.get(RequestHandlerService);

  listener.start();
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
