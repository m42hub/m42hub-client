import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { map, Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return of(true);
  }

  if (!authService.isInitialized) {
    return authService.initializeAuth().pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          router.navigate(['/login']);
          return false;
        }
      })
    );
  }

  if (authService.isLoggedIn) {
    return of(true);
  } else {
    router.navigate(['/login']);
    return of(false);
  }
};
