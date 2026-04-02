import { Component } from '@angular/core';

@Component({
  selector: 'app-amui',
  standalone: false,
  templateUrl: './amui.html',
  styleUrl: './amui.css',
})
export class Amui {

    public myData = [
      {"name": "steve", "age": 58, "city": "manchester"},
      {"name": "julie", "age": 55, "city": "dewsbury"},
      {"name": "andy", "age": 52, "city": "huddersfield"},
      {"name": "mum", "age": 82, "city": "thornhill"}
    ]

    displayedColumns: string[] = ['name', 'age', 'city'];

    selectRow(person:any) {
      console.log(person);
    }
}
