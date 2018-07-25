import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent, BotAppComponent, LoginComponent, DashboardComponent, ViewLogComponent} from './components';
import {AppRoutingModule, MaterialModule} from './modules';
import {AuthService, CronJobsService, DialogService, LogsService, SocketService, ThemeService} from './services';
import {LoginGuard} from './guards';
import {SimpleDialogComponent, DialogComponent} from "./components/dialog/";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BotAppComponent,
    DashboardComponent,
    ViewLogComponent,
    SimpleDialogComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    ThemeService,
    LoginGuard,
    AuthService,
    CronJobsService,
    LogsService,
    SocketService,
    DialogService
  ],
  entryComponents: [ SimpleDialogComponent, DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
