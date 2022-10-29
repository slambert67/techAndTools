import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sub',
  templateUrl: './sub.component.html',
  styleUrls: ['./sub.component.css']
})
export class SubComponent implements OnInit {

  @Input('squoink') subcompvar1!: string;  // member variable takes value of squoink attribute passed in

  constructor() { }

  ngOnInit(): void {
  }

}
