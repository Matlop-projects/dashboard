import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize, catchError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  // Show the spinner before handling the request
  spinner.show();

  return next(req).pipe(
    catchError((error) => {
      // Hide the spinner in case of an error
      spinner.hide();
      throw error; // Re-throw the error
    }),
    finalize(() => {
      // Hide the spinner once the request is completed (success or error)
      spinner.hide();
    })
  );
};