import { Module } from '@nestjs/common';
import { ExternalApiHandlerController } from './app.controller';
import { ExternalApiHandlerService } from './app.service';

@Module({
  imports: [],
  controllers: [ExternalApiHandlerController],
  providers: [ExternalApiHandlerService],
})
export class ExternalApiHandlerModule {}
