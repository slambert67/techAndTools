import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/test.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-component',
  templateUrl: './view-component.component.html',
  styleUrls: ['./view-component.component.css']
})
export class ViewComponentComponent implements OnInit {

  userName!: String;
  restResponse: any;

  // I need TestService
  constructor(private svc: TestService, private http: HttpClient) {
    this.svc.printToConsole('Inner module has also got the service');
  }

  ngOnInit(): void {
  }

  search() {
    this.http.get('https://api.github.com/users/' + this.userName).subscribe( (response: any) => {
      this.restResponse = response;
      console.log(this.restResponse);
    } );
  }
}
