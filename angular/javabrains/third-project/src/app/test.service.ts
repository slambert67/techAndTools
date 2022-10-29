import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  printToConsole(arg: string) {
    console.log(arg);
  }
}
