import { Test, TestingModule } from '@nestjs/testing';
import { SnsManagerService } from './sns-manager.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SNS } from 'aws-sdk';
import { LoggerService } from '@aggregator/logger';

describe('SnsManagerService', () => {
  let service: SnsManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsSdkModule.forRoot({ services: [SNS] })],
      providers: [
        {
          provide: LoggerService,
          useValue: {},
        },
        SnsManagerService,
        {
          provide: 'SNS_OPTIONS',
          useValue: { arn: 'test' },
        },
      ],
    }).compile();

    service = module.get<SnsManagerService>(SnsManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
