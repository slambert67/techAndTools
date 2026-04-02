import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContainer } from './user-container';

describe('UserContainer', () => {
  let component: UserContainer;
  let fixture: ComponentFixture<UserContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
