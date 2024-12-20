import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Visit, VisitType} from '../../../../shared/models/visit.model';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {VisitDialogComponent} from './visit-dialog/visit-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {HotToastService} from '@ngxpert/hot-toast';
import {PatientService} from '../../../../shared/services/patient.service';
import {GENDER} from '../../../../shared/models/patient.model';

@Component({
  selector: 'app-visits',
  imports: [
    MatHeaderRow,
    TranslatePipe,
    DatePipe,
    MatCheckbox,
    MatHeaderCell,
    MatTable,
    MatButton,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatRow
  ],
  templateUrl: './visits.component.html',
  standalone: true,
  styleUrl: './visits.component.css'
})
export class VisitsComponent implements OnInit {
  @Input() patientId!: string;
  @Input() visits: Visit[] = [];

  displayedColumns: string[] = ['select', 'date', 'type', 'reason', 'result'];
  dataSource: MatTableDataSource<Visit> = new MatTableDataSource<Visit>();
  visitSelection = new Set<Visit>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog,
              private translateService: TranslateService,
              private patientService: PatientService,
              private toast: HotToastService) {}

  ngOnInit(): void {
    this.patientService.getPatientVisits(this.patientId).subscribe((visits) => {
      this.visits = visits;
      this.updateTableData();
    });
  }

  updateTableData(): void {
    this.dataSource.data = this.visits;
  }

  addVisit(): void {
    const dialogRef = this.dialog.open(VisitDialogComponent, {
      width: '60vw',
      maxWidth: '60vw',
      data: { visit: null },
    });

    dialogRef.afterClosed().subscribe((result: Visit | undefined) => {
      if (result) {
        this.patientService.saveVisit(this.patientId, result).subscribe({
          next: () => {
            this.patientService.getPatientVisits(this.patientId).subscribe((visits) => {
              this.visits = visits;
              this.updateTableData();
            });
            this.toast.success(this.translateService.instant('TOAST.VISIT_ADDED'));
          },
        });
      }
    });
  }

  editVisit(): void {
    if (this.visitSelection.size === 1) {
      const selectedVisit = Array.from(this.visitSelection)[0];
      const dialogRef = this.dialog.open(VisitDialogComponent, {
        width: '60vw',
        maxWidth: '60vw',
        data: { visit: { ...selectedVisit } },
      });

      dialogRef.afterClosed().subscribe((result: Visit | undefined) => {
        if (result) {
          this.patientService.editVisit(this.patientId, result).subscribe(() => {
            this.patientService.getPatientVisits(this.patientId).subscribe((visits) => {
              this.visits = visits;
              this.updateTableData();
            })
          });
          this.toast.success(this.translateService.instant('TOAST.VISIT_UPDATED'));
        }
      });
    }
  }

  removeSelectedVisits(): void {
    this.visits = this.visits.filter((visit) => !this.visitSelection.has(visit));
    this.visitSelection.clear();
    this.updateTableData();
  }

  toggleVisitSelection(visit: Visit): void {
    if (this.visitSelection.has(visit)) {
      this.visitSelection.delete(visit);
    } else {
      this.visitSelection.add(visit);
    }
  }

  isAllVisitsSelected(): boolean {
    return this.dataSource.data.every((visit) => this.visitSelection.has(visit));
  }

  toggleSelectAllVisits(event: any): void {
    if (event.checked) {
      this.dataSource.data.forEach((visit) => this.visitSelection.add(visit));
    } else {
      this.visitSelection.clear();
    }
  }

  generateReport() {
    if (this.visitSelection.size === 1) {
      const selectedVisit = Array.from(this.visitSelection)[0];
      this.patientService.generateReport(selectedVisit.id).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'visit-report.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }

  getEnumKey(enumValue: any): string | undefined {
    return Object.keys(VisitType).find(key => VisitType[key as keyof typeof VisitType] === enumValue);
  }
}
