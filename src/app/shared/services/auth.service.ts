import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {HotToastService} from '@ngxpert/hot-toast';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  constructor(private httpClient: HttpClient,
              private router: Router,
              private toast: HotToastService,
              private translateService: TranslateService) {}

  isLoggedIn(): boolean {
    return localStorage.getItem("loggedIn") === "true";
  }

  login(username: string, password: string): void {
    this.httpClient.post('/api/auth/login', {
      username: username,
      password: password
    }).subscribe({
      next: (response) => {
        const user = response as User;
        this.toast.success(this.translateService.instant('TOAST.LOGIN_SUCCESSFUL'), {
          duration: 2000
        });
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("role", user.role);
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.toast.error(this.translateService.instant('TOAST.LOGIN_FAILED'), {
          duration: 2000
        });
      }
    });
  }

  logout(): void {
    this.httpClient.post('/api/auth/logout', {}).subscribe({
      next: () => {
        localStorage.setItem("loggedIn", "false");
        localStorage.removeItem("role");
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Logout failed', error);
      }
    });
  }

  isAdmin(): boolean {
    return localStorage.getItem("role") === "admin";
  }

}
