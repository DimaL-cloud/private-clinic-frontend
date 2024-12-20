import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatError} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {ForgotPasswordService} from '../../shared/services/forgot-password.service';
import {HotToastService} from '@ngxpert/hot-toast';

@Component({
  selector: 'app-forgot-password',
  imports: [
    MatCard,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    ReactiveFormsModule,
    MatError,
    NgIf,
    TranslatePipe,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './forgot-password.component.html',
  standalone: true,
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private forgotPasswordService: ForgotPasswordService,
              private toast: HotToastService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
        this.forgotPasswordService.sendPasswordResetLinkToEmail(this.forgotPasswordForm.value.email).subscribe({
          next: () => {
            this.toast.success(this.translate.instant('TOAST.PASSWORD_RESET_LINK_SENT'));
            this.forgotPasswordForm.reset();
          }, error: () => {

          }
        })
    }
  }

  onLanguageChange(language: string): void {
    this.translate.use(language);
  }
}
