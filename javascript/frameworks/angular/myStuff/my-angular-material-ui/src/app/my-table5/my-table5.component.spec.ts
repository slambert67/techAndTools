import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTable5Component } from './my-table5.component';

describe('MyTable5Component', () => {
  let component: MyTable5Component;
  let fixture: ComponentFixture<MyTable5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTable5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTable5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
