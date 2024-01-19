import { Test, TestingModule } from '@nestjs/testing';
import { UniqueIdGeneratorService } from './unique-id-generator.service';

describe('UniqueIdGeneratorService', () => {
  let service: UniqueIdGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniqueIdGeneratorService],
    }).compile();

    service = module.get<UniqueIdGeneratorService>(UniqueIdGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
