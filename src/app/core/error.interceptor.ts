import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../services/toaster.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
    const tosater = inject(ToasterService);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log(error.status);
            if (error.status === 401) {
              tosater.errorToaster(error.error.message);
                router.navigate(['/authentication']);
            } else if (error.status === 404) {
                // Handle 404 Not Found
                // router.navigate(['/not-found']);
            } else if (error.status == 400) {
              console.log('error in ');

              tosater.errorToaster(error.error.message);
            } else if (error.status == 403) {
              tosater.errorToaster(error.error.message);
            }

            return throwError(() => error);
        })
    );
};
