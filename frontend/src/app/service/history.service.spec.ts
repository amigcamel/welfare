import { TestBed } from '@angular/core/testing';

import { HistoryService } from './history.service';
import { HttpClientModule } from "@angular/common/http";

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(HistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
