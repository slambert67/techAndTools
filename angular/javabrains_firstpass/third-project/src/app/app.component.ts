import { Component, OnInit } from '@angular/core';
import { TestService } from './test.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // shortcut syntax. Create svc private variable and assign injected service to this
  constructor(private svc: TestService, private http: HttpClient) {
    svc.printToConsole('Got the service!');
  }

  ngOnInit() {
    let myObservable = this.http.get('https://api.github.com/users/koushikkothagal');

    myObservable.subscribe( (response) => console.log(response) );
  }
}
