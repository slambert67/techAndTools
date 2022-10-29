import { Component } from '@angular/core';
import { TestService } from './test.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // I need TestService and HttpClient service
  constructor(private svc: TestService, private http: HttpClient) {
    this.svc.printToConsole('Got the service');
  }

  ngOnInit() {
    // asynchronous operation. asynchronous object returned called an observable (Promise in angularJS)
    let obs = this.http.get('https://api.github.com/users/koushikkothagal');
    obs.subscribe( (response: any) => console.log(response));
    console.log('This prints before result from asynchronous request');
  }
}
