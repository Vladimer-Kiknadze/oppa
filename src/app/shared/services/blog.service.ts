import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Blog } from '../interfaces/blog.interface';
import { Observable, catchError, first, from, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  fireBase = inject(Firestore);
  httpClient = inject(HttpClient);
  blogsCollection = collection(this.fireBase, 'blogs');
  allBlogs = signal<Blog[]>([]);
  postDetail = signal<Blog | null>(null);

  getBlogs(): Observable<Blog[]> {
    return collectionData(this.blogsCollection, {
      idField: 'id',
    }) as Observable<Blog[]>;
  }

  getPostDetail(id: string): void {
    if (this.allBlogs().length === 0) {
      this.getBlogs()
        .pipe(
          first(),
          switchMap((blogs) => {
            this.allBlogs.set(blogs);
            const blog = blogs.find((blog) => id === blog.id) || null;
            return of(blog);
          })
        )
        .subscribe((blog) => this.postDetail.set(blog));
    } else {
      const blog = this.allBlogs().find((blog) => id === blog.id) || null;
      this.postDetail.set(blog);
    }
  }

  addBlog(
    title: string,
    description: string,
    image: string | null,
    author: string,
    category: string
  ): Observable<string> {
    if (image && !this.isValidImageUrl(image)) {
      return of('Invalid image URL');
    }

    if (image) {
      return this.isImageAccessible(image).pipe(
        switchMap((isAccessible) => {
          if (!isAccessible) {
            return of('Invalid image URL');
          }
          return this.saveBlog(title, description, image, author, category);
        })
      );
    } else {
      return this.saveBlog(title, description, image, author, category);
    }
  }

  addBLOG(
    title: string,
    description: string,
    image: string,
    author: string,
    category: string,
    id: string
  ): void {
    const newBlog: Blog = {
      title,
      description,
      image,
      category,
      author,
      date: new Date().toDateString(),
      id,
    };
    this.allBlogs.update((blogs) => [...blogs, newBlog]);
  }

  private isValidImageUrl(url: string): boolean {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' +
        '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' +
        '(\\#[-a-zA-Z\\d_]*)?$',
      'i'
    );

    if (!urlPattern.test(url)) {
      return false;
    }

    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return extensions.some((extension) =>
      url.toLowerCase().endsWith(`.${extension}`)
    );
  }

  private isImageAccessible(url: string): Observable<boolean> {
    return this.httpClient.head(url, { observe: 'response' }).pipe(
      switchMap((response) => of(response.status === 200)),
      catchError(() => of(false))
    );
  }

  private saveBlog(
    title: string,
    description: string,
    image: string | null,
    author: string,
    category: string
  ): Observable<string> {
    const blogCreate = {
      title,
      description,
      image: image || null,
      author,
      category,
      date: new Date().toDateString(),
    };
    const promise = addDoc(this.blogsCollection, blogCreate).then(
      (response) => response.id
    );
    return from(promise);
  }
}
