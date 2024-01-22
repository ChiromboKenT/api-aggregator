import { Controller, Get } from '@nestjs/common';

@Controller()
export class AggregatorCoreController {
  constructor() {}

  @Get()
  getMain(): object {
    return { status: 'operational' };
  }

  @Get('/health')
  getHealth(): object {
    return { status: 'operational' };
  }
}
