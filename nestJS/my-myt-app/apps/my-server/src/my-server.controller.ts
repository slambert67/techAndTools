import { Controller, Get, UseGuards } from '@nestjs/common';
import { MyServerService } from './my-server.service';
import { MyServerGuard } from './my-server.guard';

@Controller()
export class MyServerController {
  constructor(private readonly myServerService: MyServerService) {}

  @UseGuards(MyServerGuard)
  @Get()
  async processGetRequest(): Promise<string> {
    let response = await this.myServerService.processGetRequest();
    console.log(response);
    return response;
  }
}
