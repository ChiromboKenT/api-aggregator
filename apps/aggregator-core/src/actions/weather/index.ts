import { Injectable } from '@nestjs/common';
import { Action } from '../types';

@Injectable()
export class WeatherCoreService implements Action {
  constructor() {}
  async run(body: any) {}
}
