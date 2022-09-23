import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-c1',
  templateUrl: './c1.component.html',
  styleUrls: ['./c1.component.css']
})
export class C1Component implements OnInit {

  // define an Input attribute for this component. Input attribute name specified by parent when using this component
  @Input('c1Attribute1') attr1!: string;

  // Intercept input property changes with a setter
  @Input()
  get c1Attribute2(): number {return this.attr2}
  set c1Attribute2(x: number) {
    this.attr2 = x*2;
  }
  attr2!: number;

  // Intercept input property changes with ngOnChanges()
  // todo

  x!: boolean
  y!: string;

  // Emit event to be caught by parent
  // Event handler required in parent view - (c1Event)
  @Output() c1Event = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.c1Event.emit("Event emitted from C1");
    this.x = false;
  }

  invokedByParent() {
    this.x = !this.x;
    if (this.x) {
      this.y = "Clicked by parent";
    } else {
      this.y = "Unclicked by parent";
    }
  }

}
