import { Component, OnInit, inject, signal } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [SpinnerComponent, RouterLink, CommonModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss',
})
export class BlogsComponent implements OnInit {
  blogService = inject(BlogService);
  isLoading = signal(true);

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe(
      (blogs) => {
        this.blogService.allBlog.set(blogs);
        this.isLoading.set(false);
      },
      (error) => {
        console.error('Error loading blogs:', error);
        this.isLoading.set(false);
      }
    );
  }
}
