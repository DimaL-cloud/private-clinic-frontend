import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Medicine, MedicineType} from '../../../../../../../shared/models/medicine.model';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {VisitType} from '../../../../../../../shared/models/visit.model';

export interface MedicineDialogData {
  medicine: Medicine | null; // Null for adding a new medicament
}

@Component({
  selector: 'app-medicine-dialog',
  imports: [
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption,
    TranslatePipe,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    NgForOf,
    MatInput
  ],
  templateUrl: './medicine-dialog.component.html',
  standalone: true,
  styleUrl: './medicine-dialog.component.css'
})
export class MedicineDialogComponent {
  medicineForm: FormGroup;
  medicineTypes = Object.values(MedicineType);

  constructor(
    public dialogRef: MatDialogRef<MedicineDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: MedicineDialogData
  ) {
    const medicament = data?.medicine || new Medicine(0, '', '', MedicineType.OTHER, '');

    this.medicineForm = this.fb.group({
      name: [medicament.name, Validators.required],
      composition: [medicament.composition, Validators.required],
      type: [medicament.type, Validators.required],
      usageRecommendation: [medicament.usageRecommendation, Validators.required],
    });
  }

  onSave(): void {
    if (this.medicineForm.valid) {
      this.dialogRef.close(this.medicineForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getEnumKey(enumValue: any): string | undefined {
    return Object.keys(MedicineType).find(key => MedicineType[key as keyof typeof MedicineType] === enumValue);
  }

}
