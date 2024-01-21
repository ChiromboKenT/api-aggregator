import { Module } from '@nestjs/common';
import { AggregatorCoreController } from './app.controller';
import { AggregatorCoreService } from './app.service';

@Module({
  imports: [],
  controllers: [AggregatorCoreController],
  providers: [AggregatorCoreService],
})
export class AggregatorCoreModule {}
