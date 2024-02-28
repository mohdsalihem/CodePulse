import { Injectable, inject } from '@angular/core';
import { CategoryRequest } from './models/category-request';
import { HttpClient } from '@angular/common/http';
import { Category } from './models/category';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http = inject(HttpClient);

  baseUrl = `${environment.apiBaseUrl}/api/category`;

  add(request: CategoryRequest) {
    return this.http.post<void>(`${this.baseUrl}/create`, request);
  }

  getAll() {
    return this.http.get<Category[]>(`${this.baseUrl}/getAll`);
  }

  get(id: string) {
    return this.http.get<Category>(`${this.baseUrl}/get/${id}`);
  }

  update(id: string, request: CategoryRequest) {
    return this.http.put<Category>(`${this.baseUrl}/update/${id}`, request);
  }

  delete(id: string) {
    return this.http.delete<Category>(`${this.baseUrl}/delete/${id}`);
  }
}
