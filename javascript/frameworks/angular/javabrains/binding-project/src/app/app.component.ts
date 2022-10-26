import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  var1: string = "Parent member variable 1";
  arr1: string[] = ["first entry", "second entry"];
  inputText1!: string;
  inputText2!: string;
  inputText3!: string;
  noNgModel: string = "No ngModel!";
}
