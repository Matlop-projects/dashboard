import { ChangeDetectorRef, inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toaster = inject(ToasterService);
  const ngZone = inject(NgZone); // Inject NgZone

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error.status);

      if (error.status === 401) {
        router.navigate(['/auth/login']);

        // Run toaster inside Angular's zone to ensure it triggers change detection
        ngZone.run(() => {
          setTimeout(() => {
            toaster.errorToaster(error.error.title || 'Unauthorized');
          }, 300); // Delay the toaster for 300ms to ensure UI updates
        });
      } else if (error.status === 404) {
        // Handle 404 Not Found
      } else if (error.status === 400) {
        ngZone.run(() => {
          toaster.errorToaster(error.error.message);
        });
      } else if (error.status === 403) {
        ngZone.run(() => {
          toaster.errorToaster(error.error.message);
        });
      }

      return throwError(() => error);
    })
  );
};
