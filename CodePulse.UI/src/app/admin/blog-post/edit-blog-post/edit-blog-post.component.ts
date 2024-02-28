import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap, takeUntil } from 'rxjs';
import { BlogPostService } from '../blog-post.service';
import { destroyNotifier } from '../../../core/helpers/destroyNotifier';
import { BlogPost } from '../models/blog-post';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { formatDate } from '../../../core/helpers/utilities';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/models/category';
import { BlogPostRequest } from '../models/blog-post-request';
import { ImageSelectorComponent } from '../../../shared/image-selector/image-selector.component';
import { BlogImageService } from '../../../shared/blog-image.service';

@Component({
  selector: 'app-edit-blog-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MarkdownModule,
    ImageSelectorComponent,
  ],
  templateUrl: './edit-blog-post.component.html',
  styleUrl: './edit-blog-post.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBlogPostComponent implements OnInit {
  route = inject(ActivatedRoute);
  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);
  blogImageService = inject(BlogImageService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);

  destroy$ = destroyNotifier();
  blogPost!: BlogPost;
  categories$!: Observable<Category[]>;
  blogPostId: string | null = null;
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
    publishedDate: this.formBuilder.nonNullable.control('', [
      Validators.required,
    ]),
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

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.blogPostId = params.get('id');
          if (!this.blogPostId) {
            return of(null);
          }

          return this.blogPostService.get(this.blogPostId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((blogPost) => {
        if (blogPost) {
          this.blogPost = blogPost;
          this.form.setValue({
            title: blogPost.title,
            urlHandle: blogPost.urlHandle,
            shortDescription: blogPost.shortDescription,
            content: blogPost.content,
            featuredImageUrl: blogPost.featuredImageUrl,
            publishedDate: formatDate(new Date(blogPost.publishedDate)),
            author: blogPost.author,
            isVisible: blogPost.isVisible,
            categories: blogPost.categories.map((x) => x.id),
          });
        }
      });

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
      .update(this.blogPostId!, blogPost)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigateByUrl('/admin/blog-posts');
      });
  }

  onDelete() {
    if (!this.blogPostId) {
      return;
    }

    this.blogPostService
      .delete(this.blogPostId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/admin/blog-posts']);
      });
  }

  openImageSelector() {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector() {
    this.isImageSelectorVisible = false;
  }
}
