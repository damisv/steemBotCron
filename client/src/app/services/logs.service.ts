import {Injectable} from "@angular/core";
import {Account, LogRun} from "../models";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {HttpClient} from "@angular/common/http";
import {SocketService} from "./socket.service";
import {AuthService} from "./auth.service";
import {filter} from "rxjs/operators";
import {CronJobsService} from "./cronJobs.service";

@Injectable()
export class LogsService {
  static base = 'api/logs';

  private _logList = new BehaviorSubject<{[key: string]: LogRun}>({});
  set logList(list: {[key: string]: LogRun}) { this._logList.next(list); }
  get logList() { return this._logList.value; }
  public logList$ = this._logList.asObservable();

  constructor(private http: HttpClient,
              private socketService: SocketService,
              private authService: AuthService,
              private cronService: CronJobsService) {
    this.authService.$loggedAccount.pipe(filter( acc => acc !== null))
          .subscribe( (acc) => this.getLogs(acc));
    socketService.onNewRun().subscribe(val => {
      let temp = this.logList;
      temp[val.runID] = val.run;
      this.logList = temp;
      let tempJob = cronService.job;
      tempJob.lastRunAt = val.run.date;
      tempJob.nextRunAt = LogsService.addHours(val.run.date, 1);
      cronService.job = tempJob;
    });
    socketService.onEndRun().subscribe(val => {
      let temp = this.logList;
      temp[val.runID].errors = val.errors;
      temp[val.runID].finished = true;
      this.logList = temp;
      let tempJob = cronService.job;
      tempJob.lastFinishedAt = val.date;
      cronService.job = tempJob;
      authService.getFollowInfo();
    });
    socketService.onLogReceived().subscribe((val) => {
      const temp = this.logList;
      temp[val.id].logs.push(val.log);
      this.logList = temp;
    });
  }

  private getLogs(acc: Account) {
    this.http.post<{[key: string]: LogRun}>(LogsService.base, {acc: acc})
      .subscribe((val) => this.logList = val);
  }

  static addHours(date, hours) {
    let result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  static addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
