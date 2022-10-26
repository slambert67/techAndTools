import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

// use dynamic import expressions
const myConfig = [
  {
    myComp: () => import('../dynamic1/dynamic1.component').then(it => it.Dynamic1Component),
    inputs: {
      'attr1': "comp1 with config"
    }
  },
  {
    myComp: () => import('../dynamic2/dynamic2.component').then(it => it.Dynamic2Component),
    inputs: {
      'attr1': "comp2 with config"
    }
  }
];

@Component({
  selector: 'app-dynamic-comp-with-config',
  templateUrl: './dynamic-comp-with-config.component.html',
  styleUrls: ['./dynamic-comp-with-config.component.css']
})
export class DynamicCompWithConfigComponent implements OnInit {

  @ViewChild('mycontainertemplate2', {read: ViewContainerRef} ) myContainer!: ViewContainerRef;

  constructor() { }

  ngOnInit(): void {
  }

  createMyComponents() {
    myConfig.forEach( async compConfig => {
      const compInstance = await compConfig.myComp();
      const compRef = this.myContainer.createComponent(compInstance);

      Object.entries( compConfig.inputs ).forEach( ([key, value]) => {
        compRef.setInput(key,value);
      })
    });
  }
}
