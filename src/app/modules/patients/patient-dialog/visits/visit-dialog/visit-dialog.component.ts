import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Visit, VisitType} from '../../../../../shared/models/visit.model';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Medicine} from '../../../../../shared/models/medicine.model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MedicinesComponent} from './medicines/medicines.component';

export interface VisitDialogData {
  visit: Visit | null; // Pass null for adding a new visit
}

@Component({
  selector: 'app-visit-dialog',
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatInput,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatLabel,
    NgForOf,
    TranslatePipe,
    MedicinesComponent,
    MatTab,
    MatTabGroup,
    MatHint,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerModule,
    MatDatepickerToggle
  ],
  templateUrl: './visit-dialog.component.html',
  standalone: true,
  styleUrl: './visit-dialog.component.css'
})
export class VisitDialogComponent {
  visitForm: FormGroup;

  visitTypes = Object.values(VisitType).filter(value => typeof value === 'string');

  medicines: Medicine[] = [];

  constructor(
    public dialogRef: MatDialogRef<VisitDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: VisitDialogData
  ) {
    const visit = data?.visit || new Visit('0', new Date(), VisitType.CONSULTATION, '', '', '', []);
    this.medicines = visit.medicines;
    this.visitForm = this.fb.group({
      id: [visit.id],
      date: [visit.date, Validators.required],
      type: [visit.type, Validators.required],
      reason: [visit.reason, Validators.required],
      result: [visit.result, Validators.required],
      diagnosis: [visit.diagnosis, Validators.required],
      medicines: [visit.medicines]
    });
  }

  onSave(): void {
    if (this.visitForm.valid) {
      this.dialogRef.close(this.visitForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getEnumKey(enumValue: any): string | undefined {
    return Object.keys(VisitType).find(key => VisitType[key as keyof typeof VisitType] === enumValue);
  }

  onMedicinesChange($event: Medicine[]) {
    this.visitForm.get('medicines')?.setValue($event);
  }
}
