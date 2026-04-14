import { Component, OnInit, computed, signal } from '@angular/core';
import { Istudent } from '../../../Models/istudent';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiStudents } from '../../../Services/api-students';
import { UiToast } from '../../../Services/ui-toast';
import { UiConfirm } from '../../../Services/ui-confirm';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students implements OnInit {
  students = signal<Istudent[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal('');
  searchText = signal('');

  readonly filteredStudents = computed(() => {
    const query = this.normalizeName(this.searchText());
    if (!query) {
      return this.students();
    }

    return this.students().filter((student) => {
      const first = this.normalizeName(student.St_Fname);
      const last = this.normalizeName(student.St_Lname);
      return first.includes(query) || last.includes(query) || `${first} ${last}`.includes(query);
    });
  });

  constructor(
    private _apiStudents: ApiStudents,
    private _toast: UiToast,
    private _confirm: UiConfirm
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  async deleteStudent(id: number): Promise<void> {
    const confirmed = await this._confirm.confirm({
      title: 'Delete Student',
      message: 'This student will be removed permanently. Do you want to continue?',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) {
      return;
    }

    this._apiStudents.deleteStudent(id).subscribe({
      next: () => {
        this.students.set(this.students().filter((student) => student.St_Id !== id));
        this._toast.success('Student deleted successfully.');
      },
      error: (err) => {
        console.error('ERROR DELETING STUDENT:', err);
        this._toast.error('Failed to delete student.');
      }
    });
  }

  private loadStudents(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._apiStudents.getAllStudents().subscribe({
      next: (data) => {
        this.students.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to load students from the API.');
        this.students.set([]);
        this.isLoading.set(false);
      },
    });
  }

  private normalizeName(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  }
}

