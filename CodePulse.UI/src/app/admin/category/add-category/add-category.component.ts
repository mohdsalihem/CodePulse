import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';
import { CategoryRequest } from '../models/category-request';
import { destroyNotifier } from '../../../core/helpers/destroyNotifier';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryComponent {
  formBuilder = inject(FormBuilder);
  categoryService = inject(CategoryService);
  router = inject(Router);
  destroy$ = destroyNotifier();

  form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required]),
    urlHandle: this.formBuilder.nonNullable.control('', [Validators.required]),
  });

  onFormSubmit() {
    if (this.form.invalid) return;

    this.categoryService
      .add(this.form.value as CategoryRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/categories');
        },
      });
  }
}
