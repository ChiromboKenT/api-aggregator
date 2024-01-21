import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApiHandlerController } from './app.controller';
import { AggregatorCoreService } from './app.service';

describe('ExternalApiHandlerController', () => {
  let externalApiHandlerController: ExternalApiHandlerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExternalApiHandlerController],
      providers: [AggregatorCoreService],
    }).compile();

    externalApiHandlerController = app.get<ExternalApiHandlerController>(
      ExternalApiHandlerController,
    );
  });

  describe('root', () => {
    it('should return "Operation Status"', () => {
      expect(externalApiHandlerController.getHealth()).toBe({
        status: 'operational',
      });
    });
  });
});
