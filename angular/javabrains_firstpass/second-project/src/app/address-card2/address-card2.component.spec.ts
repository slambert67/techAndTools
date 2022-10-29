import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCard2Component } from './address-card2.component';

describe('AddressCard2Component', () => {
  let component: AddressCard2Component;
  let fixture: ComponentFixture<AddressCard2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressCard2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
