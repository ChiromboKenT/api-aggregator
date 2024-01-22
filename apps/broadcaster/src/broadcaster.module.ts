import { Module } from '@nestjs/common';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterService } from './broadcaster.service';

@Module({
  imports: [],
  controllers: [BroadcasterController],
  providers: [BroadcasterService],
})
export class BroadcasterModule {}
