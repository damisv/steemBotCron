import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, DialogService} from "../../services";
import {Router} from "@angular/router";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  myform: FormGroup;
  isLoading = false;

  private dialogData = {title: 'Invalid Credentials',
    message: 'The key&username combination entered is not valid.Please try again.'};

  constructor(private authService: AuthService,
              private dialogService: DialogService,
              private router: Router) {}

  public login() {
    this.isLoading = true;
    const account = {user: this.myform.get('email').value,
                      key: this.myform.get('password').value, publicKey: ''};
    this.authService.authenticate(account)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe( () => this.router.navigate(['app']),
        (err) => this.dialogService.showSimpleDialogWith(this.dialogData));
  }

  ngOnInit() {
    this.myform = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.authService.logOut();
  }

  getErrorMessage() {
    return this.myform.get('email').hasError('required') ? 'You must enter a value' :
      this.myform.get('email').hasError('email') ? 'Not a valid email' : '';
  }
}

