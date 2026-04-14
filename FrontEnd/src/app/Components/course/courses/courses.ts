import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Icourse } from '../../../Models/icourse';
import { ApiCourses } from '../../../Services/api-courses';
import { UiToast } from '../../../Services/ui-toast';
import { UiConfirm } from '../../../Services/ui-confirm';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {
  courses = signal<Icourse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal('');
  searchText = signal('');

  readonly filteredCourses = computed(() => {
    const query = this.normalizeName(this.searchText());
    if (!query) {
      return this.courses();
    }

    return this.courses().filter((course) => this.normalizeName(course.Crs_Name).includes(query));
  });

  constructor(
    private _apiCourses: ApiCourses,
    private _toast: UiToast,
    private _confirm: UiConfirm
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this._apiCourses.getAllCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to load courses from the API.');
        this.isLoading.set(false);
      },
    });
  }

  async deleteCourse(id: number): Promise<void> {
    const confirmed = await this._confirm.confirm({
      title: 'Delete Course',
      message: 'This course and related links will be removed. Continue?',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) return;

    this._apiCourses.deleteCourse(id).subscribe({
      next: () => {
        this.courses.set(this.courses().filter((course) => course.Crs_Id !== id));
        this._toast.success('Course deleted successfully.');
      },
      error: (err) => {
        console.error('ERROR DELETING COURSE:', err);
        this._toast.error('Failed to delete course.');
      },
    });
  }

  private normalizeName(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  }
}
