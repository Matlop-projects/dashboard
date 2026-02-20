import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toaster = inject(ToasterService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error?.error?.message ||
        error?.error?.title ||
        error?.error?.errors?.[0] ||
        '';

      switch (error.status) {
        case 401:
          toaster.errorToaster(message || 'Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          router.navigate(['/auth/login']);
          break;

        case 403:
          toaster.errorToaster(message || 'You do not have permission to perform this action.');
          break;

        case 400:
          toaster.errorToaster(message || 'Invalid request. Please check your input.');
          break;

        case 404:
          toaster.errorToaster(message || 'The requested resource was not found.');
          break;

        case 500:
          toaster.errorToaster(message || 'Server error. Please try again later.');
          break;

        case 0:
          toaster.errorToaster('Network error. Please check your connection.');
          break;

        default:
          toaster.errorToaster(message || 'An unexpected error occurred.');
          break;
      }

      return throwError(() => error);
    })
  );
};
