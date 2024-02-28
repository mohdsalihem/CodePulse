import { Injectable, inject } from '@angular/core';
import { BlogPost } from './models/blog-post';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BlogPostRequest } from './models/blog-post-request';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiBaseUrl}/api/blogpost`;

  create(request: BlogPostRequest) {
    return this.http.post<BlogPost>(`${this.baseUrl}/create`, request);
  }

  getAll() {
    return this.http.get<BlogPost[]>(`${this.baseUrl}/getAll`);
  }

  get(id: string) {
    return this.http.get<BlogPost>(`${this.baseUrl}/get/${id}`);
  }

  getByUrlHandle(urlHandle: string) {
    return this.http.get<BlogPost>(`${this.baseUrl}/get/${urlHandle}`);
  }

  update(id: string, request: BlogPostRequest) {
    return this.http.put<BlogPost>(`${this.baseUrl}/update/${id}`, request);
  }

  delete(id: string) {
    return this.http.delete<BlogPost>(`${this.baseUrl}/delete/${id}`);
  }
}
