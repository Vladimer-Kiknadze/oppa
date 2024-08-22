import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUser = signal<UserInterface | null | undefined>(undefined);
  private auth = inject(Auth);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      updateProfile(response.user, { displayName: username });
      this.setCurrentUser(response.user);
    });
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      this.setCurrentUser(response.user);
    });
    return from(promise);
  }

  logout(): Observable<void> {
    return new Observable<void>((observer) => {
      this.auth.signOut().then(
        () => {
          this.currentUserSubject.next(null);
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
  private setCurrentUser(user: User): void {
    if (user) {
      this.currentUser.set({
        email: user.email!,
        username: user.displayName!,
      });
    } else {
      this.currentUser.set(null);
    }
  }
}
