import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Idepartment } from '../../../Models/idepartment';
import { ApiDepartments } from '../../../Services/api-departments';
import { UiToast } from '../../../Services/ui-toast';

@Component({
  selector: 'app-edit-department',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-department.html',
  styleUrl: '../add-department/add-department.css',
})
export class EditDepartment implements OnInit {
  isLoading = signal(false);
  errorMessage = signal('');
  currentId = 0;

  department: Idepartment = {
    Dept_Id: 0,
    Dept_Name: '',
    Dept_Desc: '',
    Dept_Location: '',
  };

  constructor(
    private _apiDepartments: ApiDepartments,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toast: UiToast
  ) {}

  ngOnInit(): void {
    this.currentId = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    if (!this.currentId) return;

    this.isLoading.set(true);
    this._apiDepartments.getDepartmentById(this.currentId).subscribe({
      next: (data) => {
        this.department = data;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('ERROR LOADING DEPARTMENT:', err);
        this.isLoading.set(false);
        this._toast.error('Failed to load department details.');
        this._router.navigate(['/Departments']);
      },
    });
  }

  updateDepartment(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.department.Dept_Name = this.department.Dept_Name.trim();
    this.department.Dept_Desc = this.department.Dept_Desc?.trim();
    this.department.Dept_Location = this.department.Dept_Location?.trim();

    this._apiDepartments.updateDepartment(this.currentId, this.department).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._toast.success('Department updated successfully.');
        this._router.navigate(['/Departments']);
      },
      error: (err) => {
        console.error('ERROR UPDATING DEPARTMENT:', err);
        this.isLoading.set(false);
        this.errorMessage.set(this.getApiErrorMessage(err, 'Failed to update department.'));
        this._toast.error(this.errorMessage());
      },
    });
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
