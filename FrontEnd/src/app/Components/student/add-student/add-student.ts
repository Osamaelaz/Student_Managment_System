import { Component, OnInit, signal } from '@angular/core';
import { Idepartment } from '../../../Models/idepartment';
import { Istudent } from '../../../Models/istudent';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiStudents } from '../../../Services/api-students';
import { ApiDepartments } from '../../../Services/api-departments';
import { Router } from '@angular/router';
import { UiToast } from '../../../Services/ui-toast';

@Component({
  selector: 'app-add-student',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent {
  departments = signal<Idepartment[]>([]);

  isLoading = signal(false);
  errorMessage = signal('');

  newStudent: Istudent = {
    St_Id: 0,
    St_Fname: '',
    St_Lname: '',
    St_Address: '',
    St_Age: 0,
    Dept_Id: undefined,
  };

  constructor(
    private _apiStudents: ApiStudents,
    private _apiDepartments: ApiDepartments,
    private _router: Router,
    private _toast: UiToast
  ) {}

  ngOnInit(): void {
    this._apiDepartments.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error(err),
    });
  }

  addStudent() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.newStudent.St_Fname = this.newStudent.St_Fname.trim();
    this.newStudent.St_Lname = this.newStudent.St_Lname.trim();
    this.newStudent.St_Address = this.newStudent.St_Address?.trim();
    this.newStudent.St_Age = Number(this.newStudent.St_Age) || undefined;
    this.newStudent.Dept_Id = Number(this.newStudent.Dept_Id) || undefined;

    this._apiStudents.addStudent(this.newStudent).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._toast.success('Student added successfully.');
        this._router.navigate(['/Students']);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set(this.getApiErrorMessage(err, 'Failed to add student.'));
        this._toast.error(this.errorMessage());
      }
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
