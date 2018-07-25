import {Component} from "@angular/core";
import {LogsService} from "../../../services";
import {ActivatedRoute, Router} from "@angular/router";
import {LogRun} from "../../../models";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-view-log',
  templateUrl: './viewLog.component.html',
  styleUrls: ['./viewLog.component.scss']
})
export class ViewLogComponent {
  run: LogRun;
  id: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private logService: LogsService) {
    combineLatest(route.params, logService.logList$, (params, list) => ({params, list}))
      .subscribe( values => {
        this.id = values.params['id'];
        this.run = values.list[this.id];
      },
        (err) => this.router.navigateByUrl('/app'));
  }
}
