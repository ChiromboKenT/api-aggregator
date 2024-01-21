import { Injectable } from '@nestjs/common';

@Injectable()
export class ExternalApiHandlerService {
  getHello(): string {
    return 'Hello World!';
  }
}
