import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dynamic2Component } from './dynamic2.component';

describe('Dynamic2Component', () => {
  let component: Dynamic2Component;
  let fixture: ComponentFixture<Dynamic2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Dynamic2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dynamic2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
