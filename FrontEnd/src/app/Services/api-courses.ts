import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
import { Icourse } from '../Models/icourse';
import { environment } from '../../environments/environment';

export interface AssignCourseStudentsRequest {
  Crs_Id: number;
  Dept_Id: number;
  Students: number[];
}

export interface DepartmentCourseStatus {
  Crs_Id: number;
  Crs_Name: string;
  Crs_Duration?: number;
  Top_Id?: number;
  IsAssigned: boolean;
  AssignedStudentsCount: number;
}

export interface AssignedStudentCourseRecord {
  St_Id: number;
  Grade: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ApiCourses {
  private readonly coursesUrl = `${environment.baseUrl}/Courses`;
  private readonly requestTimeoutMs = 30000;

  constructor(private _httpClient: HttpClient) {}

  getAllCourses(): Observable<Icourse[]> {
    return this._httpClient.get<unknown[]>(this.coursesUrl).pipe(
      timeout(this.requestTimeoutMs),
      map((courses) => courses.map((course) => this.normalizeCourse(course))),
      catchError((error) => this.handleError(error, 'fetch courses'))
    );
  }

  getCourseById(id: number): Observable<Icourse> {
    return this._httpClient.get<unknown>(`${this.coursesUrl}/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      map((course) => this.normalizeCourse(course)),
      catchError((error) => this.handleError(error, 'fetch course by id'))
    );
  }

  addCourse(newCourse: Icourse): Observable<Icourse> {
    return this._httpClient.post<unknown>(this.coursesUrl, newCourse).pipe(
      timeout(this.requestTimeoutMs),
      map((course) => this.normalizeCourse(course)),
      catchError((error) => this.handleError(error, 'add course'))
    );
  }

  updateCourse(id: number, updatedCourse: Icourse): Observable<void> {
    return this._httpClient.put<unknown>(`${this.coursesUrl}/${id}`, updatedCourse).pipe(
      timeout(this.requestTimeoutMs),
      map(() => void 0),
      catchError((error) => this.handleError(error, 'update course'))
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.coursesUrl}/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleError(error, 'delete course'))
    );
  }

  addCourseToDepartment(deptId: number, courseId: number): Observable<unknown> {
    return this._httpClient.post(`${this.coursesUrl}/department/${deptId}/courses/${courseId}`, {}).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleError(error, 'add course to department'))
    );
  }

  removeCourseFromDepartment(deptId: number, courseId: number): Observable<unknown> {
    return this._httpClient.delete(`${this.coursesUrl}/department/${deptId}/courses/${courseId}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleError(error, 'remove course from department'))
    );
  }

  assignStudentsToCourse(payload: AssignCourseStudentsRequest): Observable<unknown> {
    return this._httpClient.post(`${this.coursesUrl}/assign-students`, payload).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleError(error, 'assign students to course'))
    );
  }

  getDepartmentCourseStatus(deptId: number): Observable<DepartmentCourseStatus[]> {
    return this._httpClient.get<unknown[]>(`${this.coursesUrl}/department/${deptId}/courses-status`).pipe(
      timeout(this.requestTimeoutMs),
      map((courses) => courses.map((course) => this.normalizeDepartmentCourseStatus(course))),
      catchError((error) => this.handleError(error, 'fetch department course status'))
    );
  }

  addDegreeForDepartmentCourse(deptId: number, courseId: number, grade: number): Observable<unknown> {
    return this._httpClient.put(`${this.coursesUrl}/department/${deptId}/courses/${courseId}/grade`, { grade }).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleError(error, 'add degree for department course'))
    );
  }

  addDegreeForStudentCourse(courseId: number, studentId: number, grade: number): Observable<unknown> {
    return this._httpClient.put(`${this.coursesUrl}/${courseId}/students/${studentId}/grade`, { grade }).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleError(error, 'add degree for student course'))
    );
  }

  getAssignedStudentsForDepartmentCourse(deptId: number, courseId: number): Observable<AssignedStudentCourseRecord[]> {
    return this._httpClient
      .get<unknown[]>(`${this.coursesUrl}/department/${deptId}/courses/${courseId}/assigned-students`)
      .pipe(
        timeout(this.requestTimeoutMs),
        map((records) =>
          records.map((record) => {
            const source = (record ?? {}) as Record<string, unknown>;
            const rawGrade = source['Grade'] ?? source['grade'] ?? null;

            return {
              St_Id: Number(source['St_Id'] ?? source['st_Id'] ?? 0),
              Grade: rawGrade === null || rawGrade === undefined ? null : Number(rawGrade),
            } satisfies AssignedStudentCourseRecord;
          })
        ),
        catchError((error) => this.handleError(error, 'fetch assigned students for department course'))
      );
  }

  private handleError(error: unknown, action: string): Observable<never> {
    console.error(`Failed to ${action}`, error);
    return throwError(() => error);
  }

  private normalizeCourse(course: unknown): Icourse {
    const source = (course ?? {}) as Record<string, unknown>;

    return {
      Crs_Id: Number(source['Crs_Id'] ?? source['crs_Id'] ?? 0),
      Crs_Name: String(source['Crs_Name'] ?? source['crs_Name'] ?? ''),
      Crs_Duration: (source['Crs_Duration'] ?? source['crs_Duration'] ?? undefined) as number | undefined,
      Top_Id: (source['Top_Id'] ?? source['top_Id'] ?? undefined) as number | undefined,
    };
  }

  private normalizeDepartmentCourseStatus(course: unknown): DepartmentCourseStatus {
    const source = (course ?? {}) as Record<string, unknown>;

    return {
      Crs_Id: Number(source['Crs_Id'] ?? source['crs_Id'] ?? 0),
      Crs_Name: String(source['Crs_Name'] ?? source['crs_Name'] ?? ''),
      Crs_Duration: (source['Crs_Duration'] ?? source['crs_Duration'] ?? undefined) as number | undefined,
      Top_Id: (source['Top_Id'] ?? source['top_Id'] ?? undefined) as number | undefined,
      IsAssigned: Boolean(source['IsAssigned'] ?? source['isAssigned'] ?? false),
      AssignedStudentsCount: Number(source['AssignedStudentsCount'] ?? source['assignedStudentsCount'] ?? 0),
    };
  }
}
