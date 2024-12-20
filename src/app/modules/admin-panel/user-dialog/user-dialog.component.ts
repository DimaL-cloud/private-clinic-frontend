import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import {ROLE, User} from '../../../shared/models/user.model';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';

export interface UserDialogData {
  user: User;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatInput,
    TranslatePipe,
    MatOption,
    MatSelect,
    NgForOf
  ]
})
export class UserDialogComponent {
  userForm: FormGroup;

  roleTypes = Object.values(ROLE);

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData
  ) {
    this.userForm = this.fb.group({
      id: [data?.user.id || ''],
      fullName: [data?.user.fullName || '', Validators.required],
      username: [data?.user.username || '', Validators.required],
      email: [data?.user.email || '', [Validators.required, Validators.email]],
      role: [data?.user.role || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getEnumKey(enumValue: any): string | undefined {
    return Object.keys(ROLE).find(key => ROLE[key as keyof typeof ROLE] === enumValue);
  }
}
