import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-c1',
  templateUrl: './c1.component.html',
  styleUrls: ['./c1.component.css']
})
export class C1Component implements OnInit, AfterViewInit {

  /*
    1st param: reference from template
    2nd param: read not always required - If simple html element  -> ElementRef: rarely require such low level access
                                          If template element     -> TemplateRef
               but some references cannot be inferred             - ViewContainerRef
               Some cannot be returned from DOM                   - ViewRef

   */
  @ViewChild("tref", {read: ElementRef}) tref!: ElementRef;


  /*
  all components are hosted inside a custom DOM element
  component and directive classes can obtain an instance of ElementRef associated with their host element through Dependency Injection (DI):
  So while a component can get access to its host element through DI,
    the ViewChild decorator is used most often to get a reference to a DOM element in its view (template).
    But, it’s reversed for directives — they have no views and they usually work directly with the element they are attached to.
   */
  constructor(private hostElement: ElementRef) {
    console.log('In constructor');
    console.log(this.hostElement.nativeElement);  // <app-c1>
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log('In after view init');
    console.log(this.tref.nativeElement); // <span>
  }
}
