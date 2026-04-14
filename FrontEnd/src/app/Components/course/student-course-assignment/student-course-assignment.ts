import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiDepartments } from '../../../Services/api-departments';
import { ApiCourses, AssignedStudentCourseRecord, DepartmentCourseStatus } from '../../../Services/api-courses';
import { ApiStudents } from '../../../Services/api-students';
import { Idepartment } from '../../../Models/idepartment';
import { Istudent } from '../../../Models/istudent';
import { UiToast } from '../../../Services/ui-toast';

interface StudentAssignmentRow extends Istudent {
  degree: number | null;
  isSaving: boolean;
}

@Component({
  selector: 'app-student-course-assignment',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-course-assignment.html',
  styleUrl: './student-course-assignment.css',
})
export class StudentCourseAssignment implements OnInit {
  departments = signal<Idepartment[]>([]);
  courses = signal<DepartmentCourseStatus[]>([]);
  studentRows = signal<StudentAssignmentRow[]>([]);

  selectedDeptId = 0;
  selectedCourseId = 0;

  isLoadingFilters = signal(false);
  isLoadingStudents = signal(false);

  readonly selectedCourseName = computed(() => {
    const selected = this.courses().find((course) => course.Crs_Id === this.selectedCourseId);
    return selected?.Crs_Name ?? '-';
  });

  constructor(
    private _apiDepartments: ApiDepartments,
    private _apiCourses: ApiCourses,
    private _apiStudents: ApiStudents,
    private _toast: UiToast
  ) {}

  ngOnInit(): void {
    this._apiDepartments.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: () => this._toast.error('Failed to load departments.'),
    });
  }

  onDepartmentChanged(): void {
    this.selectedCourseId = 0;
    this.studentRows.set([]);
    this.courses.set([]);

    if (this.selectedDeptId <= 0) {
      return;
    }

    this.isLoadingFilters.set(true);
    this._apiCourses.getDepartmentCourseStatus(this.selectedDeptId).subscribe({
      next: (data) => {
        this.courses.set(data.filter((course) => course.IsAssigned));
        this.isLoadingFilters.set(false);
      },
      error: () => {
        this.isLoadingFilters.set(false);
        this._toast.error('Failed to load department courses.');
      },
    });
  }

  onCourseChanged(): void {
    this.studentRows.set([]);

    if (this.selectedDeptId <= 0 || this.selectedCourseId <= 0) {
      this.studentRows.set([]);
      return;
    }

    this.isLoadingStudents.set(true);
    this._apiStudents.getStudentsByDepartmentId(this.selectedDeptId).subscribe({
      next: (students) => {
        this._apiCourses.getAssignedStudentsForDepartmentCourse(this.selectedDeptId, this.selectedCourseId).subscribe({
          next: (assignedRecords) => {
            this.studentRows.set(this.buildRowsWithAssignments(students, assignedRecords));
            this.isLoadingStudents.set(false);
          },
          error: () => {
            this.studentRows.set(this.buildRowsWithAssignments(students, []));
            this.isLoadingStudents.set(false);
            this._toast.error('Failed to load persisted assignment state.');
          },
        });
      },
      error: () => {
        this.studentRows.set([]);
        this.isLoadingStudents.set(false);
        this._toast.error('Failed to load students for this department.');
      },
    });
  }

  applyDegree(studentId: number): void {
    if (this.selectedCourseId <= 0) {
      this._toast.error('Select a course first.');
      return;
    }

    const row = this.studentRows().find((student) => student.St_Id === studentId);
    if (!row) {
      this._toast.error('Student row not found.');
      return;
    }

    const degreeRaw = row.degree;
    if (degreeRaw === null || degreeRaw === undefined || String(degreeRaw).trim() === '') {
      this._toast.error('Degree is required.');
      return;
    }

    const degree = Number(degreeRaw);
    if (Number.isNaN(degree) || degree < 0 || degree > 100) {
      this._toast.error('Degree must be a valid number between 0 and 100.');
      return;
    }

    this.patchStudentRow(studentId, { isSaving: true });

    this._apiCourses.addDegreeForStudentCourse(this.selectedCourseId, studentId, degree).subscribe({
      next: () => {
        this.patchStudentRow(studentId, { isSaving: false, degree });
        this._toast.success('Degree saved successfully.');
      },
      error: () => {
        this.patchStudentRow(studentId, { isSaving: false });
        this._toast.error('Failed to apply degree.');
      },
    });
  }

  updateDegree(studentId: number, value: number | null): void {
    this.patchStudentRow(studentId, { degree: value });
  }

  private patchStudentRow(studentId: number, patch: Partial<StudentAssignmentRow>): void {
    this.studentRows.set(
      this.studentRows().map((student) =>
        student.St_Id === studentId
          ? {
              ...student,
              ...patch,
            }
          : student
      )
    );
  }

  private buildRowsWithAssignments(
    students: Istudent[],
    assignedRecords: AssignedStudentCourseRecord[]
  ): StudentAssignmentRow[] {
    const assignedByStudentId = new Map<number, AssignedStudentCourseRecord>();
    for (const record of assignedRecords) {
      assignedByStudentId.set(record.St_Id, record);
    }

    return students.map((student) => {
      const assignedRecord = assignedByStudentId.get(student.St_Id);

      return {
        ...student,
        degree: assignedRecord?.Grade ?? null,
        isSaving: false,
      };
    });
  }
}
