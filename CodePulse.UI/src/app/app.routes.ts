import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { BlogDetailsComponent } from './core/blog-details/blog-details.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog/:url', component: BlogDetailsComponent },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
];
