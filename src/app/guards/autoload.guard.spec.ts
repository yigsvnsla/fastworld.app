import { TestBed } from '@angular/core/testing';

import { AutoloadGuard } from './autoload.guard';

describe('AutoloadGuard', () => {
  let guard: AutoloadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutoloadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
