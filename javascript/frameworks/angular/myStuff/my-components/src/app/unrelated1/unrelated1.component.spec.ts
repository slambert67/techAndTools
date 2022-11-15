import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Unrelated1Component } from './unrelated1.component';

describe('Unrelated1Component', () => {
  let component: Unrelated1Component;
  let fixture: ComponentFixture<Unrelated1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Unrelated1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Unrelated1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
