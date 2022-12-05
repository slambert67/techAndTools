import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, Observable } from "rxjs";
import { AxiosResponse } from "axios";

@Injectable()
export class AppService {

  constructor(private readonly httpService: HttpService) {

  }


/*  findAll(): Observable<AxiosResponse<any>> {*/
  findAll(): Observable<AxiosResponse<any>> {
    console.log('in findall');
/*    console.log(this.httpService.axiosRef);*/
/*    return this.httpService.axiosRef.get('http://localhost:4000/v1/resources/gates?numberOfFlights=2&sort=terminal|gate');*/
/*    return this.httpService.get('http://localhost:4000/v1/resources/gates?numberOfFlights=2&sort=terminal|gate',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('REST_RESOURCES_GATES:$W5ztv=xDxv@gu6@','utf-8').toString('base64'),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        }
      });*/

/*    return this.httpService.get('http://localhost:4000/v1/resources/gates?numberOfFlights=2&sort=terminal|gate',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('REST_RESOURCES_GATES:$W5ztv=xDxv@gu6@','utf-8').toString('base64')
        }
      }).pipe( map((res) => res.data));*/

    return this.httpService.get('http://10.172.252.8:4000/v1/resources/gates?numberOfFlights=2&sort=terminal|gate',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('REST_RESOURCES_GATES:$W5ztv=xDxv@gu6@','utf-8').toString('base64')
        }
      }).pipe( map((res) => res.data));

  }
}
