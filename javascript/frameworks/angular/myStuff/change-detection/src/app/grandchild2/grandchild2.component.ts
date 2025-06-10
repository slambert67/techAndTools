import { Component } from '@angular/core';

@Component({
  selector: 'app-grandchild2',
  templateUrl: './grandchild2.component.html',
  styleUrls: ['./grandchild2.component.css']
})
export class Grandchild2Component {

  viewRendered(): boolean {
    console.log('Grandchild2 rendered');
    return true;
  }
}
