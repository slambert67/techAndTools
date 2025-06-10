import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Dynamic1Component} from "../dynamic1/dynamic1.component";
import {Dynamic2Component} from "../dynamic2/dynamic2.component";

@Component({
  selector: 'app-dynamic-comp-container',
  templateUrl: './dynamic-comp-container.component.html',
  styleUrls: ['./dynamic-comp-container.component.css']
})
export class DynamicCompContainerComponent implements OnInit {

  // acquire/inject references to template elements
  @ViewChild('mycontainertemplate', {read: ViewContainerRef} ) myContainer!: ViewContainerRef;

  ngOnInit(): void {
  }

  createMyComponent() {
    this.myContainer.clear();

    const dyn1 = this.myContainer.createComponent(Dynamic1Component);
    console.log(dyn1);
    // OLD METHOD : dyn1.instance.attr1 = 'DYNAMIC ONE';
    dyn1.setInput('attr1', 'DYNAMIC ONE');

    const dyn2 = this.myContainer.createComponent(Dynamic2Component);
    console.log(dyn2);
    // OLD METHOD : dyn2.instance.attr1 = 'DYNAMIC TWO';
    dyn2.setInput('attr1', 'DYNAMIC TWO');
  }
}
