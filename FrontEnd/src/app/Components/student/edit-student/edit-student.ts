import { Component, OnInit, signal } from '@angular/core';
import { Idepartment } from '../../../Models/idepartment';
import { Istudent } from '../../../Models/istudent';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiStudents } from '../../../Services/api-students';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiDepartments } from '../../../Services/api-departments';
import { UiToast } from '../../../Services/ui-toast';

@Component({
  selector: 'app-edit-student',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-student.html',
  styleUrl: '../add-student/add-student.css',
})
export class EditStudent implements OnInit {
  departments = signal<Idepartment[]>([]);

  isLoading = signal(false);
  errorMessage = signal('');
  currentId = 0;

  student: Istudent = {
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
    private _activatedRoute: ActivatedRoute,
    private _toast: UiToast
  ) {}

  ngOnInit(): void {
    this._apiDepartments.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error(err),
    });

    this.currentId = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    if (this.currentId) {
      this.isLoading.set(true);
      this._apiStudents.getStudentById(this.currentId).subscribe({
        next: (data) => {
          this.student = data;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('ERROR LOADING STUDENT:', err);
          this.isLoading.set(false);
          this._toast.error('Failed to load student details.');
          this._router.navigate(['/Students']);
        }
      });
    }
  }

  updateStudent() {
    this.errorMessage.set('');
    this.student.St_Fname = this.student.St_Fname.trim();
    this.student.St_Lname = this.student.St_Lname.trim();
    this.student.St_Address = this.student.St_Address?.trim();
    this.student.St_Age = Number(this.student.St_Age) || undefined;
    this.student.Dept_Id = Number(this.student.Dept_Id) || undefined;

    this.isLoading.set(true);
    this._apiStudents.updateStudent(this.currentId, this.student).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._toast.success('Student updated successfully.');
        this._router.navigate(['/Students']);
      },
      error: (err) => {
        console.error('ERROR UPDATING STUDENT:', err);
        this.isLoading.set(false);
        this.errorMessage.set(this.getApiErrorMessage(err, 'Failed to update student.'));
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
