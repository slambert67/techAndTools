import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsDumbui } from './users-details-dumbui';

describe('UsersDetailsDumbui', () => {
  let component: UsersDetailsDumbui;
  let fixture: ComponentFixture<UsersDetailsDumbui>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersDetailsDumbui]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDetailsDumbui);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
