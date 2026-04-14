import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserAuth } from '../../Services/user-auth';
import { UiToast } from '../../Services/ui-toast';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  isUserLogged: boolean;
  userName = '';
  password = '';
  errorMessage = '';
  isLoading = signal(false);

  constructor(private _userAuth: UserAuth, private _router: Router, private _toast: UiToast) {
    this.isUserLogged = this._userAuth.getUserLogged();
  }

  login(): void {
    this.errorMessage = '';
    const userName = this.userName.trim();
    const password = this.password;

    this.userName = userName;
    this.isLoading.set(true);
    this._userAuth.login(userName, password).subscribe({
      next: () => {
        this.isUserLogged = this._userAuth.getUserLogged();
        this.isLoading.set(false);
        this._toast.success('Welcome back!');
        this._router.navigate(['/Students']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = this.getApiErrorMessage(err, 'Invalid username or password.');
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

    return fallback;
  }
}
