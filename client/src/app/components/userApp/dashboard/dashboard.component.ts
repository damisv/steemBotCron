import {Component} from "@angular/core";
import {Job, LogRun} from "../../../models";
import {AuthService, CronJobsService, LogsService} from "../../../services";
import {Router} from "@angular/router";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  job: Job;
  logList: LogRun[] = [];
  followInfo: {followers: number, follows: number};

  isActive = false;
  toggleBan = false;

  constructor(private cronService: CronJobsService,
              private iconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private logsService: LogsService,
              private authService: AuthService,
              private router: Router) {
    iconRegistry.addSvgIcon('run_loading',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/three-dots.svg'));
    authService.followInfo$.subscribe(val => this.followInfo = val);
    cronService.job$.pipe(filter(job => job !== null)).subscribe((job) => {
      this.job = job;
      this.isActive = true;
    });
    logsService.logList$.subscribe((list) => this.logList = Object.values(list));
  }

  public changeState(state: boolean) {
    this.toggleBan = true;
    state ? this.createJob(): this.cancelJob();
    setTimeout(() => this.toggleBan = false, 5000);
  }

  public openLog(id: string) {
    this.router.navigateByUrl(`app/run/${id}`);
  }

  private createJob() {
    this.cronService.createJob().subscribe( val => {});
  }

  private cancelJob() { this.cronService.cancelJob().subscribe(() => this.job = null) }

//   this.dialogService.showDialogWithYesNo({title: `Cancel`,
//   message: 'Do you want to cancel this job ? Have in mind that logs will also be deleted.'})
// .subscribe((result) => {
//   if (result) {
//     this.cronService.cancelJob()
//
//   }
// });
}
