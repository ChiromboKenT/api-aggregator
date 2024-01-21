import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApiHandlerController } from './app.controller';
import { ExternalApiHandlerService } from './app.service';

describe('ExternalApiHandlerController', () => {
  let externalApiHandlerController: ExternalApiHandlerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExternalApiHandlerController],
      providers: [ExternalApiHandlerService],
    }).compile();

    externalApiHandlerController = app.get<ExternalApiHandlerController>(
      ExternalApiHandlerController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(externalApiHandlerController.getHealth()).toBe({
        status: 'operational',
      });
    });
  });
});
