import {Injectable, OnDestroy} from "@angular/core";
import * as io from 'socket.io-client';
import {Observable} from "rxjs/internal/Observable";
import {Log, LogRun} from "../models";
import {AuthService} from "./auth.service";
import {filter} from "rxjs/operators";

@Injectable()
export class SocketService implements OnDestroy {
  readonly socket;

  constructor(private authService: AuthService) {
    this.socket = io();
    // Login listeners
    this.socket.on('connected', () => this.initRegister());
  }

  // EMITTERS
  private initRegister() {
    this.authService.$loggedAccount
      .pipe(filter((acc) => acc !== null))
      .subscribe((acc) => this.socket.emit('online', acc.user));
  }

  // Listeners

  // RX LISTENERS
  onLogReceived(): Observable<{id: any, log: Log}> {
    return new Observable<{id: any, log: Log}>(observer => {
      this.socket.on('logs', (log, jobID) => {
        observer.next({id: jobID, log: log})
      });
    });
  }
  onNewRun(): Observable<{runID: any, run: LogRun}> {
    return new Observable<{runID: any, run: LogRun}>(observer => {
      this.socket.on('newRun', (runID, run) => {
        observer.next({runID: runID, run: run})
      });
    });
  }
  onEndRun(): Observable<{runID: any, errors: any, date: Date}> {
    return new Observable<{runID: any, errors: any, date: Date}>(observer => {
      this.socket.on('endRun', (runID, errors, date) => {
        observer.next({runID: runID, errors: errors, date: date})
      });
    });
  }

  ngOnDestroy() { if (this.socket) { this.socket.close(); } }
}
