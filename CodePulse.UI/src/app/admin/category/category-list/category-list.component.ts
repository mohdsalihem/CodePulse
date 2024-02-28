import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../category.service';
import { destroyNotifier } from '../../../core/helpers/destroyNotifier';
import { takeUntil } from 'rxjs';
import { Category } from '../models/category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  categoryService = inject(CategoryService);
  destroy$ = destroyNotifier();
  categories?: Category[];

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.categories = response;
        },
      });
  }
}
