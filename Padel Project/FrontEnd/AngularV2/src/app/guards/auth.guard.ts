import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core'


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('authToken');

    if (token) {
      return true;
    } else {
      router.navigate(['error-page'], {
        queryParams: {
          error: '403',
          message: 'Você não tem permissão para aceder a esta página!',
          src: '../../../../../assets/images/icons/unauthorized.png'
        }
      });
      return false;
    }
  } else {
    return true;
  }
};
