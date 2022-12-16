import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ngxs1Component } from './ngxs1.component';

describe('Ngxs1Component', () => {
  let component: Ngxs1Component;
  let fixture: ComponentFixture<Ngxs1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ngxs1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ngxs1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
