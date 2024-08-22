import { Component, OnInit, inject, signal } from '@angular/core';
import { BlogService } from '../shared/services/blog.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [SpinnerComponent, RouterLink, CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  blogService = inject(BlogService);
  isLoading = signal(true);

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe(
      (blogs) => {
        this.blogService.allBlogs.set(blogs);
        this.isLoading.set(false);
      },
      (error) => {
        console.error('Error loading blogs:', error);
        this.isLoading.set(false);
      }
    );
  }
}
