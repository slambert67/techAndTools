import { TestBed } from '@angular/core/testing';

import { UnrelatedService } from './unrelated.service';

describe('UnrelatedService', () => {
  let service: UnrelatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnrelatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
