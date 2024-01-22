import { Module } from '@nestjs/common';
import { AggregatorCoreController } from './app.controller';
import { AggregatorCoreService } from './app.service';
import { DbManagerModule } from '@aggregator/db-manager';
import { LoggerModule } from '@aggregator/logger';

@Module({
  imports: [DbManagerModule, LoggerModule],
  controllers: [AggregatorCoreController],
  providers: [AggregatorCoreService],
})
export class AggregatorCoreModule {}
