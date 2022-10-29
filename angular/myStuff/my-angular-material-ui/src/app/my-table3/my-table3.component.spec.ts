import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTable3Component } from './my-table3.component';

describe('MyTable3Component', () => {
  let component: MyTable3Component;
  let fixture: ComponentFixture<MyTable3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTable3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTable3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
