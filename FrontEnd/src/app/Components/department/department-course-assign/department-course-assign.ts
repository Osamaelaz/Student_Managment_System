import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges, computed, signal } from '@angular/core';
import { ApiCourses, DepartmentCourseStatus } from '../../../Services/api-courses';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-department-course-assign',
  imports: [CommonModule],
  templateUrl: './department-course-assign.html',
  styleUrl: './department-course-assign.css',
})
export class DepartmentCourseAssign implements OnChanges {
  @Input() deptId = 0;
  @Input() deptName = '';
  @Input() startOpen = false;
  @Input() showToggle = true;

  isOpen = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  hasLoaded = signal(false);
  message = signal('');

  coursesStatus = signal<DepartmentCourseStatus[]>([]);
  private selectedByCourse = signal<Record<number, boolean>>({});
  private initialByCourse = signal<Record<number, boolean>>({});

  readonly assignedCourses = computed(() =>
    this.coursesStatus().filter((course) => this.selectedByCourse()[course.Crs_Id] ?? false)
  );

  readonly availableCourses = computed(() =>
    this.coursesStatus().filter((course) => !(this.selectedByCourse()[course.Crs_Id] ?? false))
  );

  readonly assignedCount = computed(() =>
    this.assignedCourses().length
  );

  readonly availableCount = computed(() =>
    this.availableCourses().length
  );

  readonly pendingChangesCount = computed(() => {
    const initial = this.initialByCourse();
    const selected = this.selectedByCourse();
    let changes = 0;

    for (const key of Object.keys(initial)) {
      const id = Number(key);
      if ((initial[id] ?? false) !== (selected[id] ?? false)) {
        changes++;
      }
    }

    return changes;
  });

  constructor(private _apiCourses: ApiCourses) {}

  ngOnChanges(changes: SimpleChanges): void {
    const shouldBeOpen = this.startOpen || !this.showToggle;

    if (shouldBeOpen && !this.isOpen()) {
      this.isOpen.set(true);
    }

    if (this.deptId > 0 && shouldBeOpen && !this.hasLoaded()) {
      this.loadCoursesStatus();
      return;
    }

    if (changes['deptId'] && this.deptId > 0 && this.isOpen()) {
      this.loadCoursesStatus();
    }
  }

  togglePanel(): void {
    if (!this.showToggle) {
      return;
    }

    this.message.set('');

    if (!this.isOpen()) {
      this.isOpen.set(true);
      if (!this.hasLoaded()) {
        this.loadCoursesStatus();
      }
      return;
    }

    this.isOpen.set(false);
  }

  loadCoursesStatus(): void {
    this.message.set('');

    if (this.deptId <= 0) {
      this.message.set('Department id is not valid.');
      return;
    }

    this.isLoading.set(true);
    this._apiCourses.getDepartmentCourseStatus(this.deptId).subscribe({
      next: (courses: DepartmentCourseStatus[]) => {
        this.coursesStatus.set(courses);

        const snapshot: Record<number, boolean> = {};
        for (const course of courses) {
          snapshot[course.Crs_Id] = course.IsAssigned;
        }

        this.initialByCourse.set(snapshot);
        this.selectedByCourse.set({ ...snapshot });

        this.hasLoaded.set(true);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.message.set(this.getApiErrorMessage(error, 'Failed to load courses for this department.'));
        this.hasLoaded.set(true);
        this.isLoading.set(false);
      },
    });
  }

  isChecked(courseId: number): boolean {
    return this.selectedByCourse()[courseId] ?? false;
  }

  onCourseToggle(courseId: number, checked: boolean): void {
    this.selectedByCourse.set({
      ...this.selectedByCourse(),
      [courseId]: checked,
    });
  }

  saveChanges(): void {
    this.message.set('');

    if (this.deptId <= 0) {
      this.message.set('Department id is not valid.');
      return;
    }

    const initial = this.initialByCourse();
    const selected = this.selectedByCourse();

    const toAdd: number[] = [];
    const toRemove: number[] = [];

    for (const key of Object.keys(initial)) {
      const id = Number(key);
      const oldValue = initial[id] ?? false;
      const newValue = selected[id] ?? false;

      if (oldValue === newValue) {
        continue;
      }

      if (newValue) {
        toAdd.push(id);
      } else {
        toRemove.push(id);
      }
    }

    if (toAdd.length === 0 && toRemove.length === 0) {
      this.message.set('No changes to save.');
      return;
    }

    const requests = [
      ...toAdd.map((courseId) => this._apiCourses.addCourseToDepartment(this.deptId, courseId)),
      ...toRemove.map((courseId) => this._apiCourses.removeCourseFromDepartment(this.deptId, courseId)),
    ];

    this.isSaving.set(true);
    forkJoin(requests).subscribe({
      next: () => {
        this.message.set(`Saved successfully. Added: ${toAdd.length}, Removed: ${toRemove.length}.`);
        this.isSaving.set(false);
        this.loadCoursesStatus();
      },
      error: (error: unknown) => {
        this.message.set(this.getApiErrorMessage(error, 'Failed to save course assignment changes.'));
        this.isSaving.set(false);
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
