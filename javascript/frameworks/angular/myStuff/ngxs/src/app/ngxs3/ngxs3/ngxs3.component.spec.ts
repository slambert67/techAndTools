import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ngxs3Component } from './ngxs3.component';

describe('Ngxs3Component', () => {
  let component: Ngxs3Component;
  let fixture: ComponentFixture<Ngxs3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ngxs3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ngxs3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
