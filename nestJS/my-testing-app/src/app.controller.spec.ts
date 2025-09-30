import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});



/*
If mocking

We replace the real AppService with an object that has the same method signature (getHello), but it’s a Jest mock function.
Instead of registering the real AppService, we register the mock
We check both the return value and that the controller actually delegated the call to its service

Benefits of mocking here
  You’re testing only the controller logic, not the service implementation.
  You can control the return values easily (mockReturnValue, mockResolvedValue for async).
  You can verify interactions (toHaveBeenCalled, toHaveBeenCalledWith).


This pattern is very common in NestJS:
  Controller tests → usually mock services.
  Service tests → usually mock repositories (e.g. database layers).
  End-to-end (e2e) tests → use real modules, but often with a test DB.




import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const mockAppService = {
      getHello: jest.fn().mockReturnValue('Mocked Hello!'),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return mocked value from AppService', () => {
      expect(appController.getHello()).toBe('Mocked Hello!');
      expect(appService.getHello).toHaveBeenCalled(); // verifies dependency call
    });
  });
});



*/
