import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-p1',
  templateUrl: './p1.component.html',
  styleUrls: ['./p1.component.css']
})
export class P1Component implements OnInit {

  parentName!: string;
  childEventText!: string;

  /*
  A parent component cannot use data binding to read child properties or invoke child methods
  Do both
  - create a template reference variable for the child element
  - reference that variable within the parent template
  Only template has access to child. Not the parent component
   */

  /*
  Parent calls an @ViewChild()
  The local variable approach is straightforward
  But it is limited because the parent-child wiring must be done entirely within the parent template.
  The parent component itself has no access to the child
  Because the class instances are not connected to one another, the parent class cannot access the child class properties and methods.
  When the parent component class requires that kind of access, inject the child component into the parent as a ViewChild
   */
  // todo


  /*
  Parent and children communicate using a service
  A parent component and its children share a service whose interface enables bidirectional communication within the family
  The scope of the service instance is the parent component and its children
  Components outside this component subtree have no access to the service or their communications.
   */
  // todo

  constructor() { }

  ngOnInit(): void {
    this.parentName = 'P1';
  }

  onChildEvent( eventText: string) {
    this.childEventText = eventText;
  }
}
