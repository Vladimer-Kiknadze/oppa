import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA6_VNSpukAb2yEInBoe7yU83DiqoNJqX8',
  authDomain: 'angular-blog-5af39.firebaseapp.com',
  projectId: 'angular-blog-5af39',
  storageBucket: 'angular-blog-5af39.appspot.com',
  messagingSenderId: '543327626248',
  appId: '1:543327626248:web:4e8840b6003e5e96f8ddbd',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
};
