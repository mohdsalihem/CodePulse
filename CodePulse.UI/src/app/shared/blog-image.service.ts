import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { BlogImage } from './models/blog-image';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogImageService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiBaseUrl}/api/blogimage`;
  private selectedImage$ = new Subject<BlogImage>();

  uploadImage(request: FormData) {
    return this.http.post<BlogImage>(`${this.baseUrl}/upload`, request);
  }

  getAll() {
    return this.http.get<BlogImage[]>(`${this.baseUrl}/getAll`);
  }

  selectImage(image: BlogImage) {
    this.selectedImage$.next(image);
  }

  onSelectImage() {
    return this.selectedImage$;
  }
}
