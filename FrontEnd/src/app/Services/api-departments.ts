import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
import { Idepartment } from '../Models/idepartment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiDepartments {
  private readonly departmentsUrl = `${environment.baseUrl}/Department`;
  private readonly requestTimeoutMs = 30000;

  constructor(private _httpClient: HttpClient) {}

  getAllDepartments(): Observable<Idepartment[]> {
    return this._httpClient.get<unknown[]>(this.departmentsUrl).pipe(
      timeout(this.requestTimeoutMs),
      map((departments) => departments.map((department) => this.normalizeDepartment(department))),
      catchError((error) => this.handleError(error, 'fetch departments'))
    );
  }

  getDepartmentById(id: number): Observable<Idepartment> {
    return this._httpClient.get<unknown>(`${this.departmentsUrl}/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      map((department) => this.normalizeDepartment(department)),
      catchError((error) => this.handleError(error, 'fetch department by id'))
    );
  }

  addDepartment(newDepartment: Idepartment): Observable<Idepartment> {
    return this._httpClient.post<unknown>(this.departmentsUrl, newDepartment).pipe(
      timeout(this.requestTimeoutMs),
      map((department) => this.normalizeDepartment(department)),
      catchError((error) => this.handleError(error, 'add department'))
    );
  }

  updateDepartment(id: number, updatedDepartment: Idepartment): Observable<void> {
    return this._httpClient.put<unknown>(`${this.departmentsUrl}/${id}`, updatedDepartment).pipe(
      timeout(this.requestTimeoutMs),
      map(() => void 0),
      catchError((error) => this.handleError(error, 'update department'))
    );
  }

  deleteDepartment(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.departmentsUrl}/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleError(error, 'delete department'))
    );
  }

  private handleError(error: unknown, action: string): Observable<never> {
    console.error(`Failed to ${action}`, error);
    return throwError(() => error);
  }

  private normalizeDepartment(department: unknown): Idepartment {
    const source = (department ?? {}) as Record<string, unknown>;

    return {
      Dept_Id: Number(source['Dept_Id'] ?? source['dept_Id'] ?? 0),
      Dept_Name: String(source['Dept_Name'] ?? source['dept_Name'] ?? ''),
      Dept_Desc: (source['Dept_Desc'] ?? source['dept_Desc'] ?? undefined) as string | undefined,
      Dept_Location: (source['Dept_Location'] ?? source['dept_Location'] ?? undefined) as string | undefined,
    };
  }
}
