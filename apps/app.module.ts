import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestHandlerModule } from './request-handler/src/request-handler.module';
import { CacheManagerModule } from '@aggregator/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RequestHandlerModule,
    CacheManagerModule,
  ],
})
export class AppModule {}
