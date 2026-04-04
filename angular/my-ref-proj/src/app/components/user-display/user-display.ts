import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TransformedPayloadRecord } from '../../interfaces/interfaces';

@Component({
  selector: 'app-user-display',
  standalone: false,
  templateUrl: './user-display.html',
  styleUrl: './user-display.css',
})
export class UserDisplay implements OnChanges{
  @Input() payload: TransformedPayloadRecord[] = [];


  displayedColumns: string[] = ['name', 'contact'];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
