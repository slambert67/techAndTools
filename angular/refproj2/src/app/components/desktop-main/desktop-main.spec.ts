import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopMain } from './desktop-main';

describe('DesktopMain', () => {
  let component: DesktopMain;
  let fixture: ComponentFixture<DesktopMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesktopMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
