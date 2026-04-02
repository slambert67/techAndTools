import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  //protected readonly title = signal('my-rest-app-ng');

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    console.log('init');

    this.http.get<any[]>('http://localhost:3000')
          .subscribe(
            data => {
              console.log(data);
            },
            error => {
              console.error('Error fetching users', error);
            }
          );
  }
}
