import { Component } from '@angular/core';

@Component({
  selector: 'app-child1',
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.css']
})
export class Child1Component {

  viewRendered(): boolean {
    console.log('Child1 rendered');
    return true;
  }

  inputChanged() {
    console.log('Child1 input changed');
  }

}
