import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private destroy$ = new Subject<void>();
  authService = inject(AuthService);
  isMenuOpen = false;
  isAuthLoaded = signal(false);

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.authService.currentUser.set({
            email: user.email!,
            username: user.displayName!,
          });
        } else {
          this.authService.currentUser.set(null);
        }
        this.isAuthLoaded.set(true);
      });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.isMenuOpen = false;
      this.authService.currentUser.set(null);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
