import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

/*  @Get()
  getHello(): string {
    return this.appService.getHello();
  }*/

  // works
  /*@Get()
  getHello(): string {
    let x: Observable<AxiosResponse<any>>;

    console.log('In controller');
    x= this.appService.findAll();

    x.subscribe({
      next(x) {console.log('got sub1 value '); console.log(x);},
      error(err) {console.error('something wrong occurred: ' + err)},
      complete() {console.log('Observable sub1 has completed');}
    });


    console.log('returned from service');

    return 'hello world';
  }*/

  @Get()
  getHello(): Observable<AxiosResponse<any>> {
    return this.appService.findAll();
  }


}
