import { Test, TestingModule } from '@nestjs/testing';
import { SqsManagerService } from './sqs-manager.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { LoggerService } from '@aggregator/logger';

describe('SqsManagerService', () => {
  let service: SqsManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsSdkModule.forRoot({ services: [SQS] })],
      providers: [
        SqsManagerService,
        {
          provide: 'SQS_OPTIONS',
          useValue: { url: 'test' },
        },
        {
          provide: LoggerService,
          useValue: { error: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SqsManagerService>(SqsManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
