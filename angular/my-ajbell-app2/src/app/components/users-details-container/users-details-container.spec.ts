import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsContainer } from './users-details-container';

describe('UsersDetailsContainer', () => {
  let component: UsersDetailsContainer;
  let fixture: ComponentFixture<UsersDetailsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersDetailsContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDetailsContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
