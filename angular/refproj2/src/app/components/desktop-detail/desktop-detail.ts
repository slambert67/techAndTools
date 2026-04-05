import { Component, Input } from '@angular/core';
import { Transformation } from '../../interfaces/interface';

@Component({
  selector: 'app-desktop-detail',
  standalone: false,
  templateUrl: './desktop-detail.html',
  styleUrl: './desktop-detail.css',
})
export class DesktopDetail {
  @Input() details!: Transformation;


}
