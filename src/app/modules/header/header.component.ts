import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    MatButton,
    RouterLink,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    TranslatePipe,
    NgIf
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private authService: AuthService,
              private translate: TranslateService) {
  }

  onLogout() {
    this.authService.logout();
  }

  onLanguageChange(language: string): void {
    this.translate.use(language);
  }

  showAdminPanel(): boolean {
    return this.authService.isAdmin();
  }

}
