import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Medicine, MedicineType} from '../../../../../../shared/models/medicine.model';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {MedicineDialogComponent} from './medicine-dialog/medicine-dialog.component';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-medicines',
  imports: [
    MatButton,
    TranslatePipe,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatCheckbox
  ],
  templateUrl: './medicines.component.html',
  standalone: true,
  styleUrl: './medicines.component.css'
})
export class MedicinesComponent implements OnInit{
  @Input() medicines: Medicine[] = [];
  @Output() medicinesChange = new EventEmitter<Medicine[]>();

  displayedColumns: string[] = ['select', 'id', 'name', 'type', 'composition', 'usageRecommendation'];
  dataSource: MatTableDataSource<Medicine> = new MatTableDataSource<Medicine>();
  selectedMedicines = new Set<Medicine>();
  selectedMedicine: Medicine | null = null;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.updateTableData();
  }

  updateTableData(): void {
    this.dataSource.data = this.medicines;
  }

  toggleMedicineSelection(medicine: Medicine): void {
    if (this.selectedMedicines.has(medicine)) {
      this.selectedMedicines.delete(medicine);
    } else {
      this.selectedMedicines.add(medicine);
    }
  }

  areAllMedicinesSelected(): boolean {
    return this.dataSource.data.every((medicine) => this.selectedMedicines.has(medicine));
  }

  toggleSelectAllMedicines(event: any): void {
    if (event.checked) {
      this.dataSource.data.forEach((medicine) => this.selectedMedicines.add(medicine));
    } else {
      this.selectedMedicines.clear();
    }
  }

  addMedicine(): void {
    const dialogRef = this.dialog.open(MedicineDialogComponent, {
      width: '400px',
      data: { medicines: [] },
    });

    dialogRef.afterClosed().subscribe((result: Medicine | undefined) => {
      if (result) {
        this.medicines.push(result);
        this.emitChanges();
        this.updateTableData();
      }
    });
  }

  editMedicine(): void {
    if (this.selectedMedicines.size === 1) {
      const selectedMedicine = Array.from(this.selectedMedicines)[0];
      const dialogRef = this.dialog.open(MedicineDialogComponent, {
        width: '400px',
        data: { medicament: { ...selectedMedicine } },
      });

      dialogRef.afterClosed().subscribe((result: Medicine | undefined) => {
        if (result) {
          Object.assign(selectedMedicine, result);
          this.emitChanges();
          this.updateTableData();
        }
      });
    }
  }

  removeSelectedMedicines(): void {
    this.medicines = this.medicines.filter((medicine) => !this.selectedMedicines.has(medicine));
    this.selectedMedicines.clear();
    this.emitChanges();
    this.updateTableData();
  }

  private emitChanges(): void {
    this.medicinesChange.emit(this.medicines);
  }

  getEnumKey(enumValue: any): string | undefined {
    return Object.keys(MedicineType).find(key => MedicineType[key as keyof typeof MedicineType] === enumValue);
  }
}
