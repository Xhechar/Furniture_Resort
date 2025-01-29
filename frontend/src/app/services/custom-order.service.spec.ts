import { TestBed } from '@angular/core/testing';

import { CustomOrderService } from './custom-order.service';

describe('CustomOrderService', () => {
  let service: CustomOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
