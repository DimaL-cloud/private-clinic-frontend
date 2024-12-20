import {Component, OnInit, ViewChild} from '@angular/core';
import {UserDialogComponent, UserDialogData} from './user-dialog/user-dialog.component';
import {ROLE, User} from '../../shared/models/user.model';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {HotToastService} from '@ngxpert/hot-toast';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {UserService} from '../../shared/services/user.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  imports: [
    MatCheckbox,
    MatButton,
    MatHeaderCell,
    MatTable,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatPaginator,
    MatRowDef,
    MatRow,
    MatHeaderRow,
    MatHeaderCellDef,
    MatHeaderRowDef,
    TranslatePipe
  ],
  templateUrl: './admin-panel.component.html',
  standalone: true,
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'fullName', 'username', 'email', 'role'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  users: User[] = [];
  selection = new Set<User>();
  length = 0;
  pageSize = 3;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog,
              private toast: HotToastService,
              private translate: TranslateService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers(this.pageIndex, this.pageSize).subscribe((response) => {
      this.users = response.users;
      this.length = response.total;
      this.updateTableData();
    });
  }

  updateTableData(): void {
    this.dataSource.data = this.users;
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateTableData();
  }

  toggleSelection(user: User): void {
    if (this.selection.has(user)) {
      this.selection.delete(user);
    } else {
      this.selection.add(user);
    }
  }

  toggleSelectAll(event: any): void {
    if (event.checked) {
      this.dataSource.data.forEach((user) => this.selection.add(user));
    } else {
      this.selection.clear();
    }
  }

  isAllSelected(): boolean {
    return this.dataSource.data.every((user) => this.selection.has(user));
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.userService.registerUser(result).subscribe((user) => {
          this.userService.getUsers(this.pageIndex, this.pageSize).subscribe((response) => {
            this.users = response.users;
            this.length = response.total;
            this.updateTableData();
          });
          this.toast.success(this.translate.instant('TOAST.USER_ADDED'));
        });
      }
    });
  }

  editUser(): void {
    if (this.selection.size === 1) {
      const selectedUser = Array.from(this.selection)[0];
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '400px',
        data: { user: { ...selectedUser } },
      });

      dialogRef.afterClosed().subscribe((result: User | undefined) => {
        if (result) {
          this.userService.editUser(result.id, result).subscribe(() => {
            this.userService.getUsers(this.pageIndex, this.pageSize).subscribe((response) => {
              this.users = response.users;
              this.length = response.total;
              this.updateTableData();
            });
            this.toast.success(this.translate.instant('TOAST.USER_UPDATED'));
            this.selection.clear();
          });
        }
      });
    }
  }

  removeSelectedUsers(): void {
    const removalObservables = Array.from(this.selection).map((user) =>
      this.userService.removeUser(user.id)
    );

    forkJoin(removalObservables).subscribe({
      next: () => {
        this.users = this.users.filter(
          (user) => !Array.from(this.selection).some((selected) => selected.id === user.id)
        );
        this.selection.clear();
        this.length = this.users.length;
        this.toast.success(this.translate.instant('TOAST.USER_REMOVED'));
        this.updateTableData();
      },
      error: () => {
        this.toast.error(this.translate.instant('TOAST.REMOVAL_FAILED'));
      },
    });
  }


  getEnumKey(enumValue: any): string | undefined {
    return Object.keys(ROLE).find(key => ROLE[key as keyof typeof ROLE] === enumValue);
  }
}
