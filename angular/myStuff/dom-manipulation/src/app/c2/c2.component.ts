import {AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';

/*
Template: It’s a group of DOM elements that are reused in views across the application
 */
@Component({
  selector: 'app-c2',
  templateUrl: './c2.component.html',
  styleUrls: ['./c2.component.css']
})
export class C2Component implements OnInit, AfterViewInit {
  myHostElement!: ElementRef;
  // refers to ng-template element
  @ViewChild("tpl") tpl!: TemplateRef<any>;
  @ViewChild("tpl2") tpl2!: TemplateRef<any>;

  constructor(private hostElement: ElementRef) {
    this.myHostElement = hostElement;
    console.log('In constructor');
    console.log(this.myHostElement);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //console.log('In afterviewinit');
    //console.log(this.myHostElement);  // unchanged from constructor


    console.log(this.tpl);              // TemplateRef : <ng-template #tpl>
    console.log(this.tpl2);              // TemplateRef : <ng-template #tpl2>

    console.log(this.tpl.elementRef);   // ElementRef  : The anchor element in the parent view for this embedded view
                                        //               Incorrect description???
                                        //               Holds reference to comment that replaces template contents

    console.log(this.tpl.elementRef.nativeElement);  // comment
  }
}
