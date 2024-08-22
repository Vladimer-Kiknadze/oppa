import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../shared/services/blog.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent implements OnInit {
  blogsService = inject(BlogService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  addBlogForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.addBlogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      category: [''],
    });
    this.authService.user$.subscribe((user: User | null) => {
      if (user) {
        this.authService.currentUser.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.authService.currentUser.set(null);
      }
    });
  }

  addBlog(): void {
    this.addBlogForm.markAllAsTouched();

    if (this.addBlogForm.invalid) {
      return;
    }

    this.isLoading = true;
    const currentUser = this.authService.currentUser();
    let author = currentUser ? currentUser.username : 'Anonymous';

    author = this.capitalizeName(author);

    const formValue = this.addBlogForm.value;

    if (!formValue.category) {
      formValue.category = 'Other';
    }

    if (!formValue.image) {
      delete formValue.image;
    }

    this.blogsService
      .addBlog(
        formValue.title,
        formValue.description,
        formValue.image ?? null,
        author,
        formValue.category
      )
      .subscribe(
        (addedBlogId) => {
          if (addedBlogId !== 'Invalid image URL') {
            this.blogsService.addBLOG(
              formValue.title,
              formValue.description,
              formValue.image ?? null,
              formValue.category,
              author,
              addedBlogId
            );
            this.router.navigateByUrl('');
            this.addBlogForm.reset();
          } else {
            alert('Invalid image URL. Please provide a valid image URL.');
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error adding blog:', error);
          this.isLoading = false;
        }
      );
  }

  capitalizeName(name: string): string {
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
