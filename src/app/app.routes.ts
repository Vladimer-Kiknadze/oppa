import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { NewpostComponent } from './newpost/newpost.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'newpost', component: NewpostComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: '', pathMatch: 'full', component: HomeComponent },
];
