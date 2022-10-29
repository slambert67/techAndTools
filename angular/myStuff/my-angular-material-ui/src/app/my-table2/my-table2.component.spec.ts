import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTable2Component } from './my-table2.component';

describe('MyTable2Component', () => {
  let component: MyTable2Component;
  let fixture: ComponentFixture<MyTable2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTable2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTable2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
