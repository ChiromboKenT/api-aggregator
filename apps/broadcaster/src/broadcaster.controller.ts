import { Controller, Get } from '@nestjs/common';
import { BroadcasterService } from './broadcaster.service';

@Controller()
export class BroadcasterController {
  constructor(private readonly broadcasterService: BroadcasterService) {}

  @Get()
  getHello(): string {
    return this.broadcasterService.getHello();
  }
}
