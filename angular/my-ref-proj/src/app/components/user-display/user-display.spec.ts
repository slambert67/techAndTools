import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDisplay } from './user-display';

describe('UserDisplay', () => {
  let component: UserDisplay;
  let fixture: ComponentFixture<UserDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
