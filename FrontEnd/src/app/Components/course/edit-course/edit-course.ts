import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Icourse } from '../../../Models/icourse';
import { ApiCourses } from '../../../Services/api-courses';
import { UiToast } from '../../../Services/ui-toast';

@Component({
  selector: 'app-edit-course',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-course.html',
  styleUrl: '../add-course/add-course.css',
})
export class EditCourse implements OnInit {
  isLoading = signal(false);
  errorMessage = signal('');
  currentId = 0;

  course: Icourse = {
    Crs_Id: 0,
    Crs_Name: '',
    Crs_Duration: undefined,
    Top_Id: undefined,
  };

  constructor(
    private _apiCourses: ApiCourses,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toast: UiToast
  ) {}

  ngOnInit(): void {
    this.currentId = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    if (!this.currentId) return;

    this.isLoading.set(true);
    this._apiCourses.getCourseById(this.currentId).subscribe({
      next: (data) => {
        this.course = data;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('ERROR LOADING COURSE:', err);
        this.isLoading.set(false);
        this._toast.error('Failed to load course details.');
        this._router.navigate(['/Courses']);
      },
    });
  }

  updateCourse(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.course.Crs_Name = this.course.Crs_Name.trim();
    this.course.Crs_Duration = Number(this.course.Crs_Duration) || undefined;
    this.course.Top_Id = Number(this.course.Top_Id) || undefined;

    this._apiCourses.updateCourse(this.currentId, this.course).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._toast.success('Course updated successfully.');
        this._router.navigate(['/Courses']);
      },
      error: (err) => {
        console.error('ERROR UPDATING COURSE:', err);
        this.isLoading.set(false);
        this.errorMessage.set(this.getApiErrorMessage(err, 'Failed to update course.'));
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
