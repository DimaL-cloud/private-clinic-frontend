import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Visit} from '../../../shared/models/visit.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatPaginator} from '@angular/material/paginator';
import {VisitsComponent} from './visits/visits.component';
import {GENDER} from '../../../shared/models/patient.model';

export interface PatientDialogData {
  id: number;
  uuid: string;
  policyNumber: string;
  fullName: string;
  gender: GENDER;
  birthDate: Date;
  visits: Visit[];
}

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css'],
  standalone: true,
  imports: [
    MatFormField,
    MatOption,
    MatSelect,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatLabel,
    MatHint,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTab,
    MatTabGroup,
    TranslatePipe,
    VisitsComponent,
    NgForOf,
    NgIf,
  ]
})
export class PatientDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  patientForm: FormGroup;
  visits: Visit[] = [];
  dataSource: MatTableDataSource<Visit> = new MatTableDataSource<Visit>();
  genderTypes = Object.values(GENDER).filter(value => typeof value === 'string');
  initialFormValues: any;

  constructor(
    public dialogRef: MatDialogRef<PatientDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: PatientDialogData | null
  ) {
    this.visits = data?.visits || [];
    this.patientForm = this.fb.group({
      uuid: [data?.uuid || ''],
      policyNumber: [data?.policyNumber || '', Validators.required],
      fullName: [data?.fullName || '', Validators.required],
      gender: [data?.gender || '', Validators.required],
      birthDate: [data?.birthDate || '', Validators.required],
    });
    this.initialFormValues = this.patientForm.value;
  }

  isFormUnchanged(): boolean {
    return JSON.stringify(this.initialFormValues) === JSON.stringify(this.patientForm.value);
  }

  ngOnInit(): void {
    this.updateTableData();
  }

  updateTableData(): void {
    this.dataSource.data = this.visits;
  }

  onSave(): void {
    if (this.patientForm.valid) {
      const updatedData = { ...this.patientForm.value, visits: this.visits };
      this.dialogRef.close(updatedData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getEnumKey(enumValue: any): string | undefined {
    return Object.keys(GENDER).find(key => GENDER[key as keyof typeof GENDER] === enumValue);
  }

}
