import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Blog } from '../interfaces/blog.interface';
import { Observable, first, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  fireBase = inject(Firestore);
  blogsCollection = collection(this.fireBase, 'blogs');
  allBlog = signal<Blog[]>([]);
  postDetail = signal<Blog | null>(null);

  getBlogs(): Observable<Blog[]> {
    return collectionData(this.blogsCollection, {
      idField: 'id',
    }) as Observable<Blog[]>;
  }

  getPostDetail(id: string): void {
    if (this.allBlog().length === 0) {
      this.getBlogs()
        .pipe(
          first(),
          switchMap((blogs) => {
            this.allBlog.set(blogs);
            const blog = blogs.find((blog) => id === blog.id) || null;
            return of(blog);
          })
        )
        .subscribe((blog) => this.postDetail.set(blog));
    } else {
      const blog = this.allBlog().find((blog) => id === blog.id) || null;
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
      console.error('Invalid image URL');
      return of('Invalid image URL');
    }

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

  addBLOG(
    title: string,
    description: string,
    image: string,
    author: string,
    category: string,
    id: string
  ): void {
    const newBlog: any = {
      title,
      description,
      image,
      category,
      author,
      date: new Date(),
      id,
    };
    this.allBlog.update((blogs) => [...blogs, newBlog]);
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

    const imageKeywords = ['image', 'img', 'photo', 'pic', 'thumbnail'];
    if (imageKeywords.some((keyword) => url.includes(keyword))) {
      return true;
    }

    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return extensions.some((extension) =>
      url.toLowerCase().endsWith(`.${extension}`)
    );
  }
}
