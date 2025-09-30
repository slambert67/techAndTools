import { NestModule, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
export declare class AppModule implements NestModule, OnModuleInit {
    configure(consumer: MiddlewareConsumer): void;
    onModuleInit(): void;
}
