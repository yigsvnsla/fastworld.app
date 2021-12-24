import { TestBed } from '@angular/core/testing';

import { ConectionsService } from './conections.service';

describe('ConectionsService', () => {
  let service: ConectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
