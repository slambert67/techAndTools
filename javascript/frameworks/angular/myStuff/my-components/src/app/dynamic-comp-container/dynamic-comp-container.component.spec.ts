import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCompContainerComponent } from './dynamic-comp-container.component';

describe('DynamicCompContainerComponent', () => {
  let component: DynamicCompContainerComponent;
  let fixture: ComponentFixture<DynamicCompContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicCompContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicCompContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
