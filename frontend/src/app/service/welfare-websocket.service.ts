import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/internal-compatibility';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchAll, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WelfareWebsocketService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e; }));
  private WS_ENDPOINT: string;
  constructor() {
  }

  public getNewWebSocket() {
    return webSocket(this.WS_ENDPOINT);
  }
  setWSEndpoint(token) {
    this.WS_ENDPOINT = `wss://welfare.local.com:4200/ws/?token=${token}`;
  }
}
