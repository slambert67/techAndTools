import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from './services/api-service';
import { StateService } from './services/state-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{

  constructor(public _state:StateService) {
  }

  ngOnInit() {

    // works. Now do in component
    
    this._state.appState$.subscribe({
      next: (state) => {
        console.log('app state from app.ts');
        console.log(state);
      }
    });
    this._state.loadAllData();
  }
}
