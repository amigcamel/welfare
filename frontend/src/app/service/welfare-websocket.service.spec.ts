import { TestBed } from '@angular/core/testing';

import { WelfareWebsocketService } from './welfare-websocket.service';

describe('WelfareWebsocketService', () => {
  let service: WelfareWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WelfareWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
