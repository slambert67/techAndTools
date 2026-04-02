import { Test, TestingModule } from '@nestjs/testing';
import { MyServerController } from './my-server.controller';
import { MyServerService } from './my-server.service';

describe('MyServerController', () => {
  let myServerController: MyServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MyServerController],
      providers: [MyServerService],
    }).compile();

    myServerController = app.get<MyServerController>(MyServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(myServerController.getHello()).toBe('Hello World!');
    });
  });
});
