import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Idepartment } from '../../../Models/idepartment';
import { ApiDepartments } from '../../../Services/api-departments';
import { UiToast } from '../../../Services/ui-toast';
import { UiConfirm } from '../../../Services/ui-confirm';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  departments = signal<Idepartment[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal('');
  searchText = signal('');

  readonly filteredDepartments = computed(() => {
    const query = this.normalizeName(this.searchText());
    if (!query) {
      return this.departments();
    }

    return this.departments().filter((department) => this.normalizeName(department.Dept_Name).includes(query));
  });

  constructor(
    private _apiDepartments: ApiDepartments,
    private _toast: UiToast,
    private _confirm: UiConfirm
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this._apiDepartments.getAllDepartments().subscribe({
      next: (data) => {
        this.departments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to load departments from the API.');
        this.isLoading.set(false);
      },
    });
  }

  async deleteDepartment(id: number): Promise<void> {
    const confirmed = await this._confirm.confirm({
      title: 'Delete Department',
      message: 'This department and its links will be removed. Continue?',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) return;

    this._apiDepartments.deleteDepartment(id).subscribe({
      next: () => {
        this.departments.set(this.departments().filter((department) => department.Dept_Id !== id));
        this._toast.success('Department deleted successfully.');
      },
      error: (err) => {
        console.error('ERROR DELETING DEPARTMENT:', err);
        this._toast.error(this.getApiErrorMessage(err, 'Failed to delete department.'));
      },
    });
  }

  private normalizeName(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private getApiErrorMessage(error: unknown, fallback: string): string {
    const httpError = error as HttpErrorResponse;
    const body = httpError?.error;

    if (typeof body === 'string' && body.trim().length > 0) {
      return body;
    }

    if (body && typeof body === 'object') {
      const values = Object.values(body as Record<string, unknown>);
      for (const value of values) {
        if (Array.isArray(value) && value.length > 0) {
          return String(value[0]);
        }
      }
    }

    return fallback;
  }
}
