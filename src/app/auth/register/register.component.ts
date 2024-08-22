import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, SpinnerComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: '../../shared/auth.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  http = inject(HttpClient);
  errorMessage: string | null = null;
  isLoading = false;

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    this.isLoading = true;
    const rawForm = this.form.getRawValue();
    this.authService
      .register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.code;
        },
      });
  }
}
