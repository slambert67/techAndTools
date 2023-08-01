import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent {

  viewRendered(): boolean {
    console.log('Parent rendered');
    return true;
  }

  inputChanged() {
    console.log('Parent input changed');
  }
}
