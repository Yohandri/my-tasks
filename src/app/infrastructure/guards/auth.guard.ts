import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Auth Guard
 * Protects routes from unauthenticated access
 * @constant {CanActivateFn}
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /** Check if user is authenticated */
  if (authService.isAuthenticated()) {
    return true;
  }

  /** Redirect to login if not authenticated */
  router.navigate(['/login']);
  return false;
};

/**
 * Guest Guard
 * Redirects authenticated users away from login page
 * @constant {CanActivateFn}
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /** Check if user is NOT authenticated */
  if (!authService.isAuthenticated()) {
    return true;
  }

  /** Redirect to tasks page if already authenticated */
  router.navigate(['/tasks']);
  return false;
};
