import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserAuth } from '../../Services/user-auth';
import { UiToast } from '../../Services/ui-toast';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  isUserLogged: boolean;
  fullName = '';
  userName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = signal(false);

  constructor(private _userAuth: UserAuth, private _router: Router, private _toast: UiToast) {
    this.isUserLogged = this._userAuth.getUserLogged();
  }

  submit(): void {
    this.errorMessage = '';

    this.fullName = this.fullName.trim();
    this.userName = this.userName.trim();
    this.email = this.email.trim();

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this._toast.error(this.errorMessage);
      return;
    }

    this.isLoading.set(true);

    this._userAuth
      .register({
        fullName: this.fullName,
        userName: this.userName,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this._toast.success('Account created successfully.');
          this._userAuth.logout();
          this.isUserLogged = this._userAuth.getUserLogged();
          this._router.navigate(['/Login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage = this.getApiErrorMessage(err, 'Registration failed. Please try different credentials.');
          this._toast.error(this.errorMessage);
        },
      });
  }

  logout(): void {
    this._userAuth.logout();
    this.isUserLogged = this._userAuth.getUserLogged();
    this._toast.info('Signed out successfully.');
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
