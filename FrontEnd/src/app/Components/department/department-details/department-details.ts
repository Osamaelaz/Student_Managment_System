import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Idepartment } from '../../../Models/idepartment';
import { ApiDepartments } from '../../../Services/api-departments';
import { UiToast } from '../../../Services/ui-toast';
import { UiConfirm } from '../../../Services/ui-confirm';

@Component({
  selector: 'app-department-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './department-details.html',
  styleUrl: './department-details.css',
})
export class DepartmentDetails implements OnInit {
  currentId = signal<number>(0);
  department = signal<Idepartment | null>(null);
  isLoading = signal<boolean>(true);
  isError = signal<boolean>(false);

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _apiDepartments: ApiDepartments,
    private _router: Router,
    private _toast: UiToast,
    private _confirm: UiConfirm
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id')) || 0;
        this.currentId.set(id);
        this.department.set(null);
        this.isLoading.set(true);
        this.isError.set(false);
        return this._apiDepartments.getDepartmentById(id);
      })
    ).subscribe({
      next: (data) => {
        this.department.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
        this._toast.error('Failed to load department details.');
      },
    });
  }

  goBack(): void {
    this._router.navigate(['/Departments']);
  }

  async deleteDepartment(id: number): Promise<void> {
    const confirmed = await this._confirm.confirm({
      title: 'Delete Department',
      message: 'This department will be deleted permanently. Continue?',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) return;

    this._apiDepartments.deleteDepartment(id).subscribe({
      next: () => {
        this._toast.success('Department deleted successfully.');
        this._router.navigate(['/Departments']);
      },
      error: (err) => {
        console.error('ERROR DELETING DEPARTMENT:', err);
        this._toast.error('Failed to delete department.');
      },
    });
  }
}
