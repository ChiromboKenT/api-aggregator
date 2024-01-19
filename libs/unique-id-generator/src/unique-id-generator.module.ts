import { Module } from '@nestjs/common';
import { UniqueIdGeneratorService } from './unique-id-generator.service';

@Module({
  providers: [UniqueIdGeneratorService],
  exports: [UniqueIdGeneratorService],
})
export class UniqueIdGeneratorModule {}
