import { Module } from '@nestjs/common';
import { SseManagerService } from './sse-manager.service';
import { LoggerModule } from '@aggregator/logger';

@Module({
  imports: [LoggerModule],
  providers: [SseManagerService],
  exports: [SseManagerService],
})
export class SseManagerModule {}
