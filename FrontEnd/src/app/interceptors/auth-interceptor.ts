import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserAuth } from '../Services/user-auth';
import { UiToast } from '../Services/ui-toast';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(UserAuth);
  const router = inject(Router);
  const toast = inject(UiToast);
  const url = req.url.toLowerCase();
  const isAnonymousAuthEndpoint =
    url.includes('/api/auth/login') ||
    url.includes('/api/auth/register') ||
    url.includes('/api/auth/logout');

  if (isAnonymousAuthEndpoint) {
    return next(req);
  }

  const token = auth.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigateByUrl('/Login');
      } else if (error.status === 403) {
        toast.error('Access denied. You do not have permission to perform this action.');
      }

      return throwError(() => error);
    })
  );
};
