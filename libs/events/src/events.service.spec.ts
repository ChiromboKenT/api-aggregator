import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { LoggerService } from '@aggregator/logger';
import { SnsManagerService } from '@aggregator/sns-manager';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SnsManagerService,
          useValue: '',
        },
        {
          provide: LoggerService,
          useValue: { debug: jest.fn() },
        },
        EventsService,
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
