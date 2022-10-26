import { Component } from '@angular/core';
import {HomeComponent} from "./home/home.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'routing-intro';

  routes = [
    {linkName: 'Home', url: 'home'},
    {linkName: 'Settings', url: 'settings'}
  ]

  onRouteActivate(componentRef: any) {
/*    console.log("route activated");
    console.log(componentRef);*/

    // subscribe to the event emitted by child component
    if ( !(componentRef instanceof HomeComponent) ) {
      return;
    }

    // subscribe to click event from child
    const child: HomeComponent = componentRef;
    child.clickEvent.subscribe( () => console.log("click event received from child"));
  }

  onRouteDeactivate(p_event: any) {
    console.log("route deactivated");
    console.log(p_event);
  }
}
