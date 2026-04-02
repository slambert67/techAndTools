import { Test, TestingModule } from '@nestjs/testing';
import { MyClientController } from './my-client.controller';
import { MyClientService } from './my-client.service';

describe('MyClientController', () => {
  let myClientController: MyClientController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MyClientController],
      providers: [MyClientService],
    }).compile();

    myClientController = app.get<MyClientController>(MyClientController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(myClientController.getHello()).toBe('Hello World!');
    });
  });
});
