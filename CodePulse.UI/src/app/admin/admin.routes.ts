import { Route } from '@angular/router';
import { AddBlogPostComponent } from './blog-post/add-blog-post/add-blog-post.component';
import { BlogPostListComponent } from './blog-post/blog-post-list/blog-post-list.component';
import { EditBlogPostComponent } from './blog-post/edit-blog-post/edit-blog-post.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';

export default [
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/add', component: AddCategoryComponent },
  { path: 'categories/:id', component: EditCategoryComponent },
  { path: 'blog-posts', component: BlogPostListComponent },
  { path: 'blog-posts/add', component: AddBlogPostComponent },
  { path: 'blog-posts/:id', component: EditBlogPostComponent },
] as Route[];
