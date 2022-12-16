import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ngxs2Component } from './ngxs2.component';

describe('Ngxs2Component', () => {
  let component: Ngxs2Component;
  let fixture: ComponentFixture<Ngxs2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ngxs2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ngxs2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
