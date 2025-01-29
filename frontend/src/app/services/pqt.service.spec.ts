import { TestBed } from '@angular/core/testing';

import { PqtService } from './pqt.service';

describe('PqtService', () => {
  let service: PqtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PqtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
