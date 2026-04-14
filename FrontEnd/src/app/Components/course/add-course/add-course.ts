import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Icourse } from '../../../Models/icourse';
import { ApiCourses } from '../../../Services/api-courses';
import { UiToast } from '../../../Services/ui-toast';

@Component({
  selector: 'app-add-course',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse {
  isLoading = signal(false);
  errorMessage = signal('');

  newCourse: Icourse = {
    Crs_Id: 0,
    Crs_Name: '',
    Crs_Duration: undefined,
    Top_Id: undefined,
  };

  constructor(
    private _apiCourses: ApiCourses,
    private _router: Router,
    private _toast: UiToast
  ) {}

  addCourse(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.newCourse.Crs_Name = this.newCourse.Crs_Name.trim();
    this.newCourse.Crs_Duration = Number(this.newCourse.Crs_Duration) || undefined;
    this.newCourse.Top_Id = Number(this.newCourse.Top_Id) || undefined;

    this._apiCourses.addCourse(this.newCourse).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._toast.success('Course added successfully.');
        this._router.navigate(['/Courses']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.errorMessage.set(this.getApiErrorMessage(err, 'Failed to add course.'));
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
