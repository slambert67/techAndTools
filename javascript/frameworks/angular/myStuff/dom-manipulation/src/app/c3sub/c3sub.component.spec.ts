import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C3subComponent } from './c3sub.component';

describe('C3subComponent', () => {
  let component: C3subComponent;
  let fixture: ComponentFixture<C3subComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C3subComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C3subComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
