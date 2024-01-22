import { Injectable } from '@nestjs/common';
import { Action } from '../types';

@Injectable()
export class NbaCoreService implements Action {
  constructor() {}
  async run(body: EventMessage<any>) {
    const id = body.requestId;
  }

  mapData(data: any) {}
}
