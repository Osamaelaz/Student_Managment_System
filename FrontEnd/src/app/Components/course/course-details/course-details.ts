import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Icourse } from '../../../Models/icourse';
import { ApiCourses } from '../../../Services/api-courses';
import { UiToast } from '../../../Services/ui-toast';
import { UiConfirm } from '../../../Services/ui-confirm';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetails implements OnInit {
  currentId = signal<number>(0);
  course = signal<Icourse | null>(null);
  isLoading = signal<boolean>(true);
  isError = signal<boolean>(false);

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _apiCourses: ApiCourses,
    private _router: Router,
    private _toast: UiToast,
    private _confirm: UiConfirm
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id')) || 0;
          this.currentId.set(id);
          this.course.set(null);
          this.isLoading.set(true);
          this.isError.set(false);
          return this._apiCourses.getCourseById(id);
        })
      )
      .subscribe({
        next: (data) => {
          this.course.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isError.set(true);
          this.isLoading.set(false);
          this._toast.error('Failed to load course details.');
        },
      });
  }

  goBack(): void {
    this._router.navigate(['/Courses']);
  }

  async deleteCourse(id: number): Promise<void> {
    const confirmed = await this._confirm.confirm({
      title: 'Delete Course',
      message: 'This course will be deleted permanently. Continue?',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) return;

    this._apiCourses.deleteCourse(id).subscribe({
      next: () => {
        this._toast.success('Course deleted successfully.');
        this._router.navigate(['/Courses']);
      },
      error: (err) => {
        console.error('ERROR DELETING COURSE:', err);
        this._toast.error('Failed to delete course.');
      },
    });
  }
}
