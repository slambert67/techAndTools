import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ngxs5Component } from './ngxs5.component';

describe('Ngxs5Component', () => {
  let component: Ngxs5Component;
  let fixture: ComponentFixture<Ngxs5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ngxs5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ngxs5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
