import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const router = inject(Router);
  const usersService = inject(UsersService);

  return usersService.userInfo().pipe(
    map((data: any) => {
      if (data.isAdmin) {
        return true;
      } else {
        router.navigate(['error-page'], {
          queryParams: {
            error: '403',
            message: 'Você não tem permissão para aceder a esta página!',
            src: '../../../../../assets/images/icons/unauthorized.png',
          },
        });
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
