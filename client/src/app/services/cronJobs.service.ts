import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job, Account, MyJob} from "../models";
import {BehaviorSubject} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {AuthService} from "./auth.service";
import {SocketService} from "./socket.service";

@Injectable()
export class CronJobsService {
  private static base = 'api/cron';
  private jobToCreate = new MyJob();

  // MARK: Properties
  private _job = new BehaviorSubject<Job>(null);

  get job() { return this._job.value; }
  set job(job: Job) { this._job.next(job); }

  public job$ = this._job.asObservable();

  constructor(private http: HttpClient,
              private authService: AuthService,
              private socketService: SocketService) {
    authService.$loggedAccount.pipe(filter( (acc) => acc !== null))
      .subscribe( (acc) => {
        this.jobToCreate.data.username = acc.user;
        this.jobToCreate.data.key = acc.key;
        this.jobToCreate.data.jobName = `Cron${acc.user}`;
        this.getJob(acc);
      });
  }

  private getJob(acc: Account) {
    this.http.post<Job>(CronJobsService.base, {acc: acc})
        .subscribe((job) => this.job = job);
  }

  public createJob() {
    const acc = this.authService.loggedAccount;
    return this.http.post<Job>(`${CronJobsService.base}/create`, {acc: acc, job: this.jobToCreate})
      .pipe(tap( (_) => this.getJob(acc)));
  }

  public cancelJob() {
    const acc = this.authService.loggedAccount;
    return this.http.post(`${CronJobsService.base}/cancel`, {acc: acc, id: this.job._id})
      .pipe(tap( () => this.getJob(acc)));
  }
}
