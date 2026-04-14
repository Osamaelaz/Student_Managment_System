import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Idepartment } from '../../../Models/idepartment';
import { ApiDepartments } from '../../../Services/api-departments';
import { UiToast } from '../../../Services/ui-toast';

@Component({
  selector: 'app-add-department',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-department.html',
  styleUrl: './add-department.css',
})
export class AddDepartment {
  isLoading = signal(false);
  errorMessage = signal('');

  newDepartment: Idepartment = {
    Dept_Id: 0,
    Dept_Name: '',
    Dept_Desc: '',
    Dept_Location: '',
  };

  constructor(
    private _apiDepartments: ApiDepartments,
    private _router: Router,
    private _toast: UiToast
  ) {}

  addDepartment(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.newDepartment.Dept_Name = this.newDepartment.Dept_Name.trim();
    this.newDepartment.Dept_Desc = this.newDepartment.Dept_Desc?.trim();
    this.newDepartment.Dept_Location = this.newDepartment.Dept_Location?.trim();

    this._apiDepartments.addDepartment(this.newDepartment).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._toast.success('Department added successfully.');
        this._router.navigate(['/Departments']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.errorMessage.set(this.getApiErrorMessage(err, 'Failed to add department.'));
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
