import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = cookieService.get('Authorization');
  return authService.user().pipe(
    map((user) => {
      if (token && user && user.roles.includes('Writer')) {
        return true;
      }

      return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
    })
  );
};
