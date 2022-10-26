import { Component } from '@angular/core';
import {Observable, of, map, Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  obs1!: Observable<string>;
  obs2!: Observable<string>;

  obs3: Observable<number> = new Observable(subscriber => {

    let x = 1;

    let interval = setInterval(() => {
      subscriber.next(x)
      x++;
    }, 5000)
  });

  ngOnInit() {
    this.obs1 = of('a','b','c');
    this.obs1.subscribe( x => console.log(x));

    console.log('obs2');
    this.obs2 = of('a','b','c');

    console.log('sub3');
    let sub3 = this.obs3.subscribe({
      next(x) {
        console.log('got sub3 value ' + x);
      },
      error(err) {
        console.error('something wrong occurred: ' + err)
      },
      complete() {
        console.log('Observable sub1 has completed');
      }
    });

  }
}
