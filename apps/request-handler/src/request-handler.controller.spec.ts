import { Test, TestingModule } from '@nestjs/testing';
import { RequestHandlerController } from './request-handler.controller';
import { RequestHandlerService } from './request-handler.service';

describe('RequestHandlerController', () => {
  let requestHandlerController: RequestHandlerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RequestHandlerController],
      providers: [RequestHandlerService],
    }).compile();

    requestHandlerController = app.get<RequestHandlerController>(
      RequestHandlerController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(requestHandlerController.getAllGames()).toHaveBeenCalled();
    });
  });
});
