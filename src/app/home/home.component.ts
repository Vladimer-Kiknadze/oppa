import { Component } from '@angular/core';
import { BlogsComponent } from '../blogs/blogs.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BlogsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
