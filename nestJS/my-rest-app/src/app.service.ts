import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello() {

    return [{name:'Steve'},{name:'Andy'}];
    /*const response = await fetch('http://localhost:3001', {
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();*/
  }
}
