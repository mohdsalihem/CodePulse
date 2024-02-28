import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogImageService } from '../blog-image.service';
import { Observable } from 'rxjs';
import { BlogImage } from '../models/blog-image';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.scss',
})
export class ImageSelectorComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  blogImageService = inject(BlogImageService);

  form = this.formBuilder.nonNullable.group({
    fileName: this.formBuilder.nonNullable.control('', [Validators.required]),
    title: this.formBuilder.nonNullable.control('', [Validators.required]),
  });

  file?: File;
  images$?: Observable<BlogImage[]>;

  ngOnInit(): void {
    this.getImages();
  }

  onFileUploadChange(event: Event) {
    this.file = (event.target as HTMLInputElement).files?.[0];
  }

  OnFileSubmit() {
    if (this.form.invalid) return;

    if (!this.file) return;

    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('title', this.form.value.title!);
    formData.append('fileName', this.form.value.fileName!);
    this.blogImageService.uploadImage(formData).subscribe({
      next: (value) => {
        this.form.reset();
        this.getImages();
      },
    });
  }

  selectImage(image: BlogImage) {
    this.blogImageService.selectImage(image);
  }

  private getImages() {
    this.images$ = this.blogImageService.getAll();
  }
}
