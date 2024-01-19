import { Module } from '@nestjs/common';
import { RequestHandlerController } from './request-handler.controller';
import { RequestHandlerService } from './request-handler.service';
import { UniqueIdGeneratorModule } from '@aggregator/unique-id-generator';

@Module({
  imports: [UniqueIdGeneratorModule],
  controllers: [RequestHandlerController],
  providers: [RequestHandlerService],
})
export class RequestHandlerModule {}
