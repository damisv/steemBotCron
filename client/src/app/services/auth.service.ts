import {Injectable} from '@angular/core';
import {Account} from '../models';
import * as steem from 'steem';
import {BehaviorSubject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class AuthService {
  private _loggedAccount = new BehaviorSubject<Account>(null);
  set loggedAccount(account: Account) { this._loggedAccount.next(account); }
  get loggedAccount() { return this._loggedAccount.value; }

  public $loggedAccount = this._loggedAccount.asObservable();

  private _user = new BehaviorSubject(null);
  set user(user: any) { this._user.next(user); }
  get user() { return this._user.value; }

  public $user = this._user.asObservable();

  private _followInfo = new BehaviorSubject<{followers: number, follows: number}>(null);
  public followInfo$ = this._followInfo.asObservable();

  constructor() {
    steem.api.setOptions({ url: 'https://api.steemit.com' });
  }

  public authenticate(account: Account): Observable<boolean> {
    return new Observable<boolean>(observer => {
      steem.api.getAccounts([account.user], (err, result) => {
        if (err) { observer.error(err); return; }
        try {
          const publicKey = result[0].posting.key_auths[0][0];
          const privateKey = account.key;
          steem.auth.wifIsValid(privateKey, publicKey);
          account.publicKey = publicKey;
          this.loggedAccount = account;
          this.user = result[0];
          observer.next(true);
          observer.complete();
          this.getFollowInfo();
        } catch (error) { observer.error(error); }
      })
    });
  }

  private getFollowInfo() {
    steem.api.getFollowCount(this.user.name, (err: any, result: any) => {
      if (err) return;
      this._followInfo.next({followers: result['follower_count'],
          follows: result['following_count']})
    });
  }

  public logOut() {
    this.loggedAccount = null;
    this.user = null;
  }

  public async isAuthenticated() {
    if (this.loggedAccount == null) { return false; }
    try {
      const publicKey = this.user.posting.key_auths[0][0];
      steem.auth.wifIsValid(this.loggedAccount.key, publicKey);
      return true;
    } catch (error) { return false; }
  }
}
