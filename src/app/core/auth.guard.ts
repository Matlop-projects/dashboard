import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
console.log(localStorage.getItem('token'));

  if (localStorage.getItem('token')) {
    return true;
  } else {
    router.navigate(['/authentication']);
    return false;
  }
};
