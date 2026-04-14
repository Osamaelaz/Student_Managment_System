import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  expiresAt: string;
  userName: string;
  email: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  fullName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserAuth {
  private readonly tokenKey = 'Token';
  private authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());
  readonly isLoggedIn = signal(this.hasToken());

  constructor(private _httpClient: HttpClient) {}

  login(userName: string, password: string): Observable<LoginResponse> {
    return this._httpClient.post<LoginResponse>(`${environment.baseUrl}/Auth/login`, { userName, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        this.syncAuthState(true);
      })
    );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this._httpClient.post<LoginResponse>(`${environment.baseUrl}/Auth/register`, data).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        this.syncAuthState(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.syncAuthState(false);
  }

  getUserLogged(): boolean {
    return this.isLoggedIn();
  }

  getAuthSubject(): BehaviorSubject<boolean> {
    return this.authSubject;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private syncAuthState(isLoggedIn: boolean): void {
    this.authSubject.next(isLoggedIn);
    this.isLoggedIn.set(isLoggedIn);
  }
}
