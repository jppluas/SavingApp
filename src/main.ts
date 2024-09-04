import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database'; // Importar módulos necesarios
import { environment } from './environments/environment';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { onAuthStateChanged } from '@firebase/auth';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => {
      const auth = getAuth();
      const router = inject(Router);

      onAuthStateChanged(auth, user => {
        if (user) {
          // Si el usuario está autenticado, redirige a tabs/tab1
          router.navigate(['/home']);
        } else {
          // Si no está autenticado, redirige al login
          router.navigate(['/login']);
        }
      });

      return auth;
    }),
    provideDatabase(() => getDatabase()), // Proveedor para Realtime Database
  ],
});