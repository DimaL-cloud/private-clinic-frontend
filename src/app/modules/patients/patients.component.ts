import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Patient, GENDER} from '../../shared/models/patient.model';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';
import {PatientDialogComponent, PatientDialogData} from './patient-dialog/patient-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {PatientService} from '../../shared/services/patient.service';
import {HotToastService} from '@ngxpert/hot-toast';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-patients',
  imports: [
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatHeaderCell,
    MatCell,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatRowDef,
    MatHeaderRowDef,
    TranslatePipe,
    MatCheckbox,
    MatButton,
    DatePipe
  ],
  templateUrl: './patients.component.html',
  standalone: true,
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['select', 'id', 'policyNumber', 'fullName', 'gender', 'birthDate'];
  dataSource: MatTableDataSource<Patient> = new MatTableDataSource<Patient>();

  patients: Patient[] = [];

  length = 0;
  pageSize = 3;
  pageIndex = 0;

  selection = new Set<Patient>();

  protected readonly GENDER = GENDER;

  constructor(private dialog: MatDialog,
              private patientService: PatientService,
              private translateService: TranslateService,
              private toast: HotToastService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.patientService.getPatients(this.pageSize, this.pageIndex).subscribe((response) => {
      this.patients = response.patients;
      this.length = response.totalAmount
      this.updateTableData();
    });
  }

  updateTableData(): void {
    this.dataSource.data = this.patients;
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.patientService.getPatients(this.pageSize, this.pageIndex).subscribe((response) => {
      this.patients = response.patients;
      this.length = response.totalAmount
      this.updateTableData();
    });
  }

  toggleSelection(patient: Patient): void {
    if (this.selection.has(patient)) {
      this.selection.delete(patient);
    } else {
      this.selection.add(patient);
    }
  }

  isAllSelected(): boolean {
    return this.length != 0 && this.dataSource.data.every((patient) => this.selection.has(patient));
  }

  toggleSelectAll(event: any): void {
    if (event.checked) {
      this.dataSource.data.forEach((patient) => this.selection.add(patient));
    } else {
      this.dataSource.data.forEach((patient) => this.selection.delete(patient));
    }
  }

  isAnySelected(): boolean {
    return this.selection.size > 0 && !this.isAllSelected();
  }

  addPatient(): void {
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      width: '60vw',
      maxWidth: '60vw',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result: PatientDialogData | undefined) => {
      if (result) {
        this.patientService.savePatient(result).subscribe({
          next: () => {
            this.toast.success(this.translateService.instant('TOAST.PATIENT_ADDED'));
            this.patientService.getPatients(this.pageSize, this.pageIndex).subscribe((response) => {
              this.patients = response.patients;
              this.length = response.totalAmount
              this.updateTableData();
            });
          }
        });
      }
    });
  }

  editPatient(): void {
    if (this.selection.size === 1) {
      const selectedPatient = Array.from(this.selection)[0];
      const dialogRef = this.dialog.open(PatientDialogComponent, {
        width: '60vw',
        maxWidth: '60vw',
        data: { ...selectedPatient },
      });

      dialogRef.afterClosed().subscribe((result: PatientDialogData | undefined) => {
        if (result) {
          this.patientService.editPatient(result.uuid, result).subscribe(() => {
            this.patientService.getPatients(this.pageSize, this.pageIndex).subscribe((response) => {
              this.patients = response.patients;
              this.length = response.totalAmount
              this.updateTableData();
              this.toast.success(this.translateService.instant('TOAST.PATIENT_UPDATED'));
              this.selection.clear();
            });
          });
        }
      });
    }
  }

  removeSelectedPatients(): void {
    const removalObservables = Array.from(this.selection).map((patient) =>
      this.patientService.removePatient(patient.uuid)
    );

    forkJoin(removalObservables).subscribe({
      next: () => {
        this.patients = this.patients.filter(
          (p) => !Array.from(this.selection).some((selected) => selected.id === p.id)
        );
        this.updateTableData();
        this.toast.success(this.translateService.instant('TOAST.PATIENT_REMOVED'));
      },
      error: (error) => {
        this.toast.error(this.translateService.instant('TOAST.REMOVAL_FAILED'));
      },
    });
  }

  getEnumKey(enumValue: any): string | undefined {
    return Object.keys(GENDER).find(key => GENDER[key as keyof typeof GENDER] === enumValue);
  }

}
