import {Component} from '@angular/core';
import {AuthService, MaterialTheme, ThemeService} from '../../../services';
import {Account} from '../../../models';

@Component({
  selector: 'app-bot-app',
  templateUrl: './botApp.component.html',
  styleUrls: ['./botApp.scss']
})
export class BotAppComponent {
  themes = [
    { 'title': 'Dark', 'value': MaterialTheme.dark},
    { 'title': 'Light', 'value': MaterialTheme.light}];

  account: Account;
  user;

  constructor(private themeService: ThemeService,
              private authService: AuthService) {
    authService.$user.subscribe((user) => {
      console.log(user);
      this.user = user
    });
    authService.$loggedAccount.subscribe((account) => this.account = account);
  }

  // MARK: Public methods
  public changeTheme(theme: MaterialTheme) {
    this.themeService.changeThemeTo(theme);
  }
}
