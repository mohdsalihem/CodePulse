import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthRequest } from '../models/auth-request';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  form = this.formBuilder.nonNullable.group({
    email: this.formBuilder.nonNullable.control('', [Validators.required]),
    password: this.formBuilder.nonNullable.control('', [Validators.required]),
  });

  onFormSubmit() {
    if (this.form.invalid) return;

    this.authService
      .login(this.form.value as AuthRequest)
      .subscribe((response) => {
        if (response.token) {
          this.cookieService.set(
            'Authorization',
            `Bearer ${response.token}`,
            undefined,
            '/',
            undefined,
            true,
            'Strict'
          );
          this.authService.setUser({
            email: response.email,
            roles: response.roles,
          });
          this.router.navigate(['/']);
        }
      });
  }
}
