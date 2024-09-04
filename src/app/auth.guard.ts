import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const unprotectedRoutes = ['/login', '/register'];
  if (unprotectedRoutes.includes(state.url)) {
    return true;  // Permitir acceso sin autenticación
  }

  // Proteger otras rutas
  const authState$ = new Observable<boolean>((observer) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        observer.next(true);
        observer.complete();
      } else {
        router.navigate(['/login']);
        observer.next(false);
        observer.complete();
      }
    });
  });

  return authState$;
};
