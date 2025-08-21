import { inject, PLATFORM_ID } from '@angular/core';
import type { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import type { Observable } from 'rxjs';
import { map, of } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return of(true);
  }

  const redirectToLogin = () => {
    // Armazena a URL atual para redirecionamento após login
    // Se for uma URL de edição, redireciona para a página de detalhes após login
    let redirectUrl = state.url;
    const editUrlMatch = state.url.match(/^\/projects\/(\d+)\/edit$/);
    if (editUrlMatch) {
      const projectId = editUrlMatch[1];
      redirectUrl = `/projects/${projectId}`;
    }

    authService.setRedirectUrl(redirectUrl);
    void router.navigate(['/login']);
    return false;
  };

  if (!authService.isInitialized) {
    return authService.initializeAuth().pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          return redirectToLogin();
        }
      }),
    );
  }

  if (authService.isLoggedIn) {
    return of(true);
  } else {
    return of(redirectToLogin());
  }
};
