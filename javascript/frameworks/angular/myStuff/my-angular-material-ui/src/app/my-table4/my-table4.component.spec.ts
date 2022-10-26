import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTable4Component } from './my-table4.component';

describe('MyTable4Component', () => {
  let component: MyTable4Component;
  let fixture: ComponentFixture<MyTable4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTable4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTable4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
