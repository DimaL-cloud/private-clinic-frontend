import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HeaderComponent} from './modules/header/header.component';
import {NgIf} from '@angular/common';
import {filter} from 'rxjs';
import {ResetPasswordComponent} from './modules/reset-password/reset-password.component';
import {LoginComponent} from './modules/login/login.component';
import {ForgotPasswordComponent} from './modules/forgot-password/forgot-password.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TranslateModule,
    HeaderComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  showHeader: boolean = false;

  constructor(private translate: TranslateService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.translate.addLangs(['uk', 'en']);
    this.translate.setDefaultLang('uk');
    this.translate.use('uk');
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.activatedRoute.root.firstChild?.snapshot.routeConfig?.component;
      this.showHeader = currentRoute !== LoginComponent && currentRoute !== ResetPasswordComponent && currentRoute !== ForgotPasswordComponent;
    });
  }

}
