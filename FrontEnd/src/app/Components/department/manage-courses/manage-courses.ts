import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDepartments } from '../../../Services/api-departments';
import { DepartmentCourseAssign } from '../department-course-assign/department-course-assign';
import { UiToast } from '../../../Services/ui-toast';

@Component({
  selector: 'app-manage-courses',
  imports: [CommonModule, DepartmentCourseAssign],
  templateUrl: './manage-courses.html',
  styleUrl: './manage-courses.css',
})
export class ManageCourses implements OnInit {
  deptId = signal(0);
  deptName = signal('');
  isLoading = signal(true);
  isError = signal(false);

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _apiDepartments: ApiDepartments,
    private _toast: UiToast
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((params) => {
      const id = Number(params.get('id')) || 0;
      this.deptId.set(id);
      this.loadDepartmentMeta(id);
    });
  }

  backToDepartments(): void {
    this._router.navigate(['/Departments']);
  }

  private loadDepartmentMeta(deptId: number): void {
    if (deptId <= 0) {
      this.isError.set(true);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.isError.set(false);

    this._apiDepartments.getDepartmentById(deptId).subscribe({
      next: (dept) => {
        this.deptName.set(dept.Dept_Name);
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
        this._toast.error('Failed to load selected department.');
      },
    });
  }
}
