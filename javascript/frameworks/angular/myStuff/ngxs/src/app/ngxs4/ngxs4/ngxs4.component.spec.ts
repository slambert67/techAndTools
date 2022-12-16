import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ngxs4Component } from './ngxs4.component';

describe('Ngxs4Component', () => {
  let component: Ngxs4Component;
  let fixture: ComponentFixture<Ngxs4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ngxs4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ngxs4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
