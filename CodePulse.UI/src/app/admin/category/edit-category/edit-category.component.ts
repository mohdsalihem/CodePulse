import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { destroyNotifier } from '../../../core/helpers/destroyNotifier';
import { map, of, switchMap, takeUntil } from 'rxjs';
import { CategoryService } from '../category.service';
import { Category } from '../models/category';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryRequest } from '../models/category-request';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss',
})
export class EditCategoryComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  categoryService = inject(CategoryService);
  formBuiler = inject(FormBuilder);
  destroy$ = destroyNotifier();
  category!: Category;
  categoryId: string | null = null;

  form = this.formBuiler.group({
    name: this.formBuiler.nonNullable.control('', [Validators.required]),
    urlHandle: this.formBuiler.nonNullable.control('', [Validators.required]),
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.categoryId = params.get('id');
          if (!this.categoryId) {
            return of(null);
          }

          return this.categoryService.get(this.categoryId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((category) => {
        if (category) {
          this.category = category;
          this.form.setValue({
            name: category.name,
            urlHandle: category.urlHandle,
          });
        }
      });
  }

  onFormSubmit() {
    this.categoryService
      .update(this.categoryId!, this.form.value as CategoryRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/admin/categories']);
      });
  }

  onDelete() {
    this.categoryService
      .delete(this.categoryId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/admin/categories']);
      });
  }
}
