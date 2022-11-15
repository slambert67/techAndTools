import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C2subComponent } from './c2sub.component';

describe('C2subComponent', () => {
  let component: C2subComponent;
  let fixture: ComponentFixture<C2subComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C2subComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C2subComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
