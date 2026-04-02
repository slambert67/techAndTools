import { Module } from '@nestjs/common';
import { MyClientController } from './my-client.controller';
import { MyClientService } from './my-client.service';

@Module({
  imports: [],
  controllers: [MyClientController],
  providers: [MyClientService],
})
export class MyClientModule {}
