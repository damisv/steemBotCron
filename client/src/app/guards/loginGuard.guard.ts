import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services';
import {Injectable} from "@angular/core";

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate() {
    const isValid =  await this.authService.isAuthenticated();
    if (!isValid) { this.router.navigate(['/'])}
    return true;
  }
}
