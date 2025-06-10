import { Component } from '@angular/core';

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.css']
})
export class Child2Component {

  viewRendered(): boolean {
    console.log('Child2 rendered');
    return true;
  }

  inputChanged() {
    console.log('Child2 input changed');
  }

}
