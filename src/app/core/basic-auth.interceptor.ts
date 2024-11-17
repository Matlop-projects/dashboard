import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let authReq = req;

  if (localStorage.getItem('token')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `${localStorage.getItem('token')}`,
        'Accept-Language': localStorage.getItem('lang') === 'ar' ? 'ar' : 'en'
      }
    });
  }

  return next(authReq);
};