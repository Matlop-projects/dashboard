import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  // Skip spinner for notification polling
  const isNotificationRequest = req.url.includes('/notifications');

  if (!isNotificationRequest) {
    spinner.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!isNotificationRequest) {
        spinner.hide();
      }
    })
  );
};
