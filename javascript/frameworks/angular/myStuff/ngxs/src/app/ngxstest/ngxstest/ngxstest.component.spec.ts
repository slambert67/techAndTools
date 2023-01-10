import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxstestComponent } from './ngxstest.component';

describe('NgxstestComponent', () => {
  let component: NgxstestComponent;
  let fixture: ComponentFixture<NgxstestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxstestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxstestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
