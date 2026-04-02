import { Controller, Get } from '@nestjs/common';
import { MyClientService } from './my-client.service';

@Controller()
export class MyClientController {
  constructor(private readonly myClientService: MyClientService) {}

  @Get()
  floodServer(): Promise<string> {
    return this.myClientService.floodServer();
  }
}
