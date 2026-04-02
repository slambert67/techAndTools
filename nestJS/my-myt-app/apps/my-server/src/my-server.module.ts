import { Module } from '@nestjs/common';
import { MyServerController } from './my-server.controller';
import { MyServerService } from './my-server.service';
import { MyServerGuard } from './my-server.guard';

@Module({
  imports: [],
  controllers: [MyServerController],
  providers: [MyServerService],
})
export class MyServerModule {}
