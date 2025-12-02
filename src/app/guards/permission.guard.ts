import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionsService = inject(PermissionsService);
  const router = inject(Router);

  // Get the current route path
  const currentRoute = state.url;

  // Check if user has permission to access this route
  const hasPermission = permissionsService.canAccessRoute(currentRoute);

  if (!hasPermission) {
    // Redirect to dashboard or unauthorized page
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

