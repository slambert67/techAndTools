import { Module } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

@Module({})
export class InterceptionModule {
    exports: [LoggingInterceptor]
}
