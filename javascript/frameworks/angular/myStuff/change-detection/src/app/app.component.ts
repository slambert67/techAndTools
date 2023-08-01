import {Component, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges{
  title = 'change-detection';

  ngOnChanges(changes: SimpleChanges) {
    console.log('Root changes detected');
  }

  viewRendered(): boolean {
    console.log('Root rendered');
    return true;
  }
}
