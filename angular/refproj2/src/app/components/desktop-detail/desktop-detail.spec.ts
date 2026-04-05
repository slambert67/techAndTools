import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopDetail } from './desktop-detail';

describe('DesktopDetail', () => {
  let component: DesktopDetail;
  let fixture: ComponentFixture<DesktopDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesktopDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
