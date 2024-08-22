import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../shared/services/blog.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [SpinnerComponent, RouterLink, CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  blogService = inject(BlogService);

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          if (!id) {
            this.router.navigateByUrl('');
            return of(null);
          }

          return this.blogService.getBlogs().pipe(
            switchMap((blogs) => {
              const blog = blogs.find((b) => b.id === id);

              if (!blog) {
                this.router.navigateByUrl('/404');
                return of(null);
              }

              this.blogService.postDetail.set(blog);
              return of(blog);
            })
          );
        })
      )
      .subscribe();
  }
}
