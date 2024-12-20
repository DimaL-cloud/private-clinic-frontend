import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AuthService} from '../../shared/services/auth.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    MatCardContent,
    MatCardHeader,
    ReactiveFormsModule,
    MatError,
    MatCardTitle,
    NgIf,
    TranslatePipe,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    RouterLink
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
    }
  }

  onLanguageChange(language: string): void {
    this.translate.use(language);
  }
}
