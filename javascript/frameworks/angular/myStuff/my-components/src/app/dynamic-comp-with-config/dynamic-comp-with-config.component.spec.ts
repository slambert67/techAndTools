import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCompWithConfigComponent } from './dynamic-comp-with-config.component';

describe('DynamicCompWithConfigComponent', () => {
  let component: DynamicCompWithConfigComponent;
  let fixture: ComponentFixture<DynamicCompWithConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicCompWithConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicCompWithConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
