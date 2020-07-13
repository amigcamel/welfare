import { TestBed } from '@angular/core/testing';

import { WelfareSpinnerService } from './welfare-spinner.service';

describe('WelfareSpinnerService', () => {
  let service: WelfareSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WelfareSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
