import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthRequest } from './models/auth-request';
import { environment } from '../../environments/environment';
import { AuthResponse } from './models/auth-response';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from './models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private user$ = new BehaviorSubject<User | undefined>(
    JSON.parse(localStorage.getItem('user')!)
  );

  private baseUrl = `${environment.apiBaseUrl}/api/auth`;

  login(request: AuthRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request);
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));

    this.user$.next(user);
  }

  user() {
    return this.user$.asObservable();
  }

  logout() {
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.user$.next(undefined);
  }
}
