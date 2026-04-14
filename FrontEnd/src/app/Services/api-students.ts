import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
import { Istudent, IstudentGrade } from '../Models/istudent';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiStudents {
  private readonly studentsUrl = `${environment.baseUrl}/Students`;
  private readonly requestTimeoutMs = 30000;

  constructor(private _httpClient: HttpClient) { }

  getAllStudents(): Observable<Istudent[]> {
    return this._httpClient.get<unknown[]>(this.studentsUrl).pipe(
      timeout(this.requestTimeoutMs),
      map((students) => students.map((student) => this.normalizeStudent(student))),
      catchError((error) => this.handleError(error, 'fetch students'))
    );
  }

  getStudentById(id: number): Observable<Istudent> {
    return this._httpClient.get<unknown>(`${this.studentsUrl}/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      map((student) => this.normalizeStudent(student)),
      catchError((error) => this.handleError(error, 'fetch student by id'))
    );
  }

  getStudentsByDepartmentId(deptId: number): Observable<Istudent[]> {
    return this.getAllStudents().pipe(
      map((students) => students.filter((student) => Number(student.Dept_Id) === Number(deptId)))
    );
  }

  addStudent(newStudent: Istudent): Observable<Istudent> {
    return this._httpClient.post<unknown>(this.studentsUrl, newStudent).pipe(
      timeout(this.requestTimeoutMs),
      map((student) => this.normalizeStudent(student)),
      catchError((error) => this.handleError(error, 'add student'))
    );
  }

  updateStudent(id: number, updatedStudent: Istudent): Observable<void> {
    return this._httpClient.put<unknown>(`${this.studentsUrl}/${id}`, updatedStudent).pipe(
      timeout(this.requestTimeoutMs),
      map(() => void 0),
      catchError((error) => this.handleError(error, 'update student'))
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.studentsUrl}/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleError(error, 'delete student'))
    );
  }

  private handleError(error: unknown, action: string): Observable<never> {
    console.error(`Failed to ${action}`, error);
    return throwError(() => error);
  }

  private normalizeStudent(student: unknown): Istudent {
    const source = (student ?? {}) as Record<string, unknown>;

    return {
      St_Id: Number(source['St_Id'] ?? source['st_Id'] ?? 0),
      St_Fname: String(source['St_Fname'] ?? source['st_Fname'] ?? ''),
      St_Lname: String(source['St_Lname'] ?? source['st_Lname'] ?? ''),
      St_Address: (source['St_Address'] ?? source['st_Address'] ?? undefined) as string | undefined,
      St_Age: (source['St_Age'] ?? source['st_Age'] ?? undefined) as number | undefined,
      Dept_Id: (source['Dept_Id'] ?? source['dept_Id'] ?? undefined) as number | undefined,
      Dept_Name: (source['Dept_Name'] ?? source['dept_Name'] ?? undefined) as string | undefined,
      Grades: this.normalizeGrades(source['Grades'] ?? source['grades']),
    };
  }

  private normalizeGrades(rawGrades: unknown): IstudentGrade[] {
    if (!Array.isArray(rawGrades)) {
      return [];
    }

    return rawGrades
      .map((grade) => {
        const source = (grade ?? {}) as Record<string, unknown>;
        const rawDegree = source['Grade'] ?? source['grade'] ?? null;

        return {
          Crs_Id: Number(source['Crs_Id'] ?? source['crs_Id'] ?? 0),
          Crs_Name: String(source['Crs_Name'] ?? source['crs_Name'] ?? ''),
          Grade: rawDegree === null || rawDegree === undefined || rawDegree === '' ? null : Number(rawDegree),
        } satisfies IstudentGrade;
      })
      .filter((grade) => grade.Crs_Id > 0);
  }
}
