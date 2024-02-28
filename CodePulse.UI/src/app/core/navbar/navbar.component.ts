import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { destroyNotifier } from '../helpers/destroyNotifier';
import { takeUntil } from 'rxjs';
import { User } from '../../auth/models/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  destroy$ = destroyNotifier();

  user?: User;

  ngOnInit(): void {
    this.authService
      .user()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
