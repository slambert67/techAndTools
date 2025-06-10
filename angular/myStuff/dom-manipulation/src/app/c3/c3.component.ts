import {AfterViewInit, ApplicationRef, Component, ComponentRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {C3subComponent} from "../c3sub/c3sub.component";

@Component({
  selector: 'app-c3',
  templateUrl: './c3.component.html',
  styleUrls: ['./c3.component.css'],
})
export class C3Component implements OnInit, AfterViewInit {

  // constructor(private app:ApplicationRef)
// ComponentRef.instance

  //@ViewChild('subcomp') mysubcomp!: ComponentRef<C3subComponent>;
  @ViewChild("subcomp", {read: ComponentRef}) mysubcomp!: ComponentRef<any>;

  constructor(private app:ApplicationRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log('this');
    console.log(this);

  }
}
