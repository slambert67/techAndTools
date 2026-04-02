import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Amui } from './amui';

describe('Amui', () => {
  let component: Amui;
  let fixture: ComponentFixture<Amui>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Amui]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Amui);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
