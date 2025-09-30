import { Module, NestModule, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger.middleware';


@Module({
  imports: [],                        // other modules to use
  controllers: [AppController],       // controllers that handle incoming requests
  providers: [AppService],            // services or values available via Dependency Injection. associate the TOKEN AppService with the class AppService 
  exports: []                         // providers that should be visible to importing modules
})
export class AppModule implements NestModule, OnModuleInit{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('family');
  }

  onModuleInit() {
    console.log('AppModule initialised');
  }
}             

// IOC system performs a lookup on AppService TOKEN to get appropriate class

/*
Above is shorthand

providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
*/


