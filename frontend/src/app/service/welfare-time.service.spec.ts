import { TestBed } from '@angular/core/testing';

import { WelfareTimeService } from './welfare-time.service';

describe('WelfareTimeService', () => {
  let service: WelfareTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WelfareTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
