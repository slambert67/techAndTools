import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDumbui } from './users-dumbui';

describe('UsersDumbui', () => {
  let component: UsersDumbui;
  let fixture: ComponentFixture<UsersDumbui>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersDumbui]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDumbui);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
