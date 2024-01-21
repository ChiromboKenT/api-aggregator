import { Inject, Injectable } from '@nestjs/common';
import { Action } from './types';

@Injectable()
export class ActionsDictionary {
  private list: Map<string, Action>;

  constructor(@Inject('ACTION_LIST') input) {
    this.list = new Map(input);
  }

  get(actionType): Action {
    if (!this.list.has(actionType)) {
      throw new Error(`Unknown action: ${actionType}`);
    }

    return this.list.get(actionType);
  }
}
