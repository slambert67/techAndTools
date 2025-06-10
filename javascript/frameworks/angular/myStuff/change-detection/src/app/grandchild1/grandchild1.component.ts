import { Component } from '@angular/core';

@Component({
  selector: 'app-grandchild1',
  templateUrl: './grandchild1.component.html',
  styleUrls: ['./grandchild1.component.css']
})
export class Grandchild1Component {

  viewRendered(): boolean {
    console.log('Grandchild1 rendered');
    return true;
  }
}
