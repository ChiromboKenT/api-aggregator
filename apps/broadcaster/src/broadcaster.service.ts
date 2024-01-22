import { Injectable } from '@nestjs/common';

@Injectable()
export class BroadcasterService {
  getHello(): string {
    return 'Hello World!';
  }
}
