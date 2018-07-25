import {DataSource} from "@angular/cdk/table";
import {BehaviorSubject, merge, Observable, of as observableOf} from 'rxjs';
import {MatPaginator} from "@angular/material";
import {catchError, startWith, switchMap} from "rxjs/operators";

export class MySimpleDataSource<T> extends DataSource<T> {
  data: T[];

  constructor(private dataObservable: Observable<T[]>) {
    super();
    this.dataObservable.subscribe(data => this.data = data);
  }

  connect(): Observable<T[]> { return this.dataObservable; }
  disconnect() {}
}

export class MyDataSource<T> extends DataSource<T> {
  data: T[];

  _filterChange = new BehaviorSubject<string>(null);

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(private dataObservable: Observable<T[]>,
              private _paginator: MatPaginator) {
    super();
    this.dataObservable.subscribe(data => this.data = data);
  }

  connect(): Observable<any> {
    const displayDataChanges = [
      this.dataObservable,
      this._paginator.page,
      this._filterChange
    ];
    return merge(...displayDataChanges)
      .pipe(
        startWith({}),
        switchMap( () => {
          console.log(this.data);
          const cdata = this.data.slice();
          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          this._paginator.length = cdata.length;
          return cdata.splice(startIndex, this._paginator.pageSize);
        }),
        catchError( () => {
          return observableOf([]);
        })
        );
  }

  disconnect() {}
}
