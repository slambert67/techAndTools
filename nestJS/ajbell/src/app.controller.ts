import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get('/users')
  async getUsers() {
    return await this.appService.getUsers();
  }


  @Get('/allUserDetails')
  async getAllUserDetails() {
    return await this.appService.getAllUserDetails();
  }
  /*@Get(':id')
  async getUser( @Param('id', ParseIntPipe) id: number ) {
    return await this.appService.getUser(id);
  }*/


  @Get('/refproj')
  async getData() {
    return await this.appService.getData();
    //throw new NotFoundException('Resource not found');
  }
}
