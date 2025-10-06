import { Module } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

@Module({})
export class MiddlewareModule {
    exports: [LoggerMiddleware]
}
