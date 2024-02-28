import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostService } from '../blog-post.service';
import { destroyNotifier } from '../../../core/helpers/destroyNotifier';
import { Observable, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/models/category';
import { BlogPostRequest } from '../models/blog-post-request';
import { formatDate } from '../../../core/helpers/utilities';
import { ImageSelectorComponent } from '../../../shared/image-selector/image-selector.component';
import { BlogImageService } from '../../../shared/blog-image.service';

@Component({
  selector: 'app-add-blog-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MarkdownModule,
    ImageSelectorComponent,
  ],
  templateUrl: './add-blog-post.component.html',
  styleUrl: './add-blog-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBlogPostComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  blogImageService = inject(BlogImageService);

  destroy$ = destroyNotifier();
  categories$!: Observable<Category[]>;
  isImageSelectorVisible = false;

  form = this.formBuilder.group({
    title: this.formBuilder.nonNullable.control('', [Validators.required]),
    shortDescription: this.formBuilder.nonNullable.control('', [
      Validators.required,
    ]),
    urlHandle: this.formBuilder.nonNullable.control('', [Validators.required]),
    content: this.formBuilder.nonNullable.control('', [Validators.required]),
    featuredImageUrl: this.formBuilder.nonNullable.control('', [
      Validators.required,
    ]),
    author: this.formBuilder.nonNullable.control('', [Validators.required]),
    isVisible: this.formBuilder.nonNullable.control(true, [
      Validators.required,
    ]),
    publishedDate: this.formBuilder.nonNullable.control(
      formatDate(new Date()),
      [Validators.required]
    ),
    categories: this.formBuilder.nonNullable.control(
      [''],
      [Validators.required]
    ),
  });

  get imageSelectorClass() {
    return this.isImageSelectorVisible ? 'd-block' : 'd-none';
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAll();

    this.blogImageService
      .onSelectImage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.url) {
          this.closeImageSelector();
          this.form.patchValue({ featuredImageUrl: response.url });
        }
      });
  }

  OnFormSubmit() {
    if (this.form.invalid) return;

    let blogPost = {
      ...this.form.value,
      publishedDate: new Date(this.form.controls.publishedDate.value),
    } as BlogPostRequest;

    this.blogPostService
      .create(blogPost)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigateByUrl('/admin/blog-posts');
      });
  }

  openImageSelector() {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector() {
    this.isImageSelectorVisible = false;
  }
}
