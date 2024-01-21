import { Injectable } from '@nestjs/common';

@Injectable()
export class AggregatorCoreService {
  getHello(): string {
    return 'Hello World!';
  }
}
