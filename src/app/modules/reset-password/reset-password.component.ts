import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgIf} from '@angular/common';
import {ForgotPasswordService} from '../../shared/services/forgot-password.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatMenu,
    MatMenuItem,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    MatMenuTrigger
  ],
  templateUrl: './reset-password.component.html',
  standalone: true,
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  email: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private forgotPasswordService: ForgotPasswordService,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      this.token = params['token'] || null;
    });
  }

  passwordMatchValidator(group: AbstractControl): void {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    const confirmPasswordControl = group.get('confirmPassword');

    if (confirmPasswordControl) {
      const errors = confirmPasswordControl.errors || {};
      if (password !== confirmPassword) {
        errors['passwordMismatch'] = true;
      } else {
        delete errors['passwordMismatch'];
      }
      confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.forgotPasswordService.resetPassword(this.email!, this.token!, this.resetPasswordForm.value.password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => {
        }
      });
    }
  }

  onLanguageChange(language: string): void {
    this.translate.use(language);
  }
}
