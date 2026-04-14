import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Istudent } from '../../../Models/istudent';
import { CommonModule } from '@angular/common';
import { ApiStudents } from '../../../Services/api-students';
import { switchMap } from 'rxjs';
import { UiToast } from '../../../Services/ui-toast';
import { UiConfirm } from '../../../Services/ui-confirm';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  currentId = signal<number>(0);
  student = signal<Istudent | null>(null);
  isLoading = signal<boolean>(true);
  isError = signal<boolean>(false);

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _apiStudents: ApiStudents,
    private _router: Router,
    private _toast: UiToast,
    private _confirm: UiConfirm
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id')) || 0;
        this.currentId.set(id);
        this.isLoading.set(true);
        this.isError.set(false);
        this.student.set(null);
        return this._apiStudents.getStudentById(id);
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.student.set(data);
          this.isError.set(false);
        } else {
          this.isError.set(true);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isError.set(true);
        this.isLoading.set(false);
        this._toast.error('Failed to load student details.');
      }
    });
  }

  goBack(): void {
    this._router.navigate(['/Students']);
  }

  async deleteStudent(id: number): Promise<void> {
    const confirmed = await this._confirm.confirm({
      title: 'Delete Student',
      message: 'This student will be removed permanently. Continue?',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) {
      return;
    }

    this._apiStudents.deleteStudent(id).subscribe({
      next: () => {
        this._toast.success('Student deleted successfully.');
        this._router.navigate(['/Students']);
      },
      error: (err) => {
        console.error('ERROR DELETING STUDENT:', err);
        this._toast.error('Failed to delete student.');
      }
    });
  }
}
