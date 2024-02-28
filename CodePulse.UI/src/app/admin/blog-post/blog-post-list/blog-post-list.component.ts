import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../blog-post.service';
import { destroyNotifier } from '../../../core/helpers/destroyNotifier';
import { takeUntil } from 'rxjs';
import { BlogPost } from '../models/blog-post';

@Component({
  selector: 'app-blog-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post-list.component.html',
  styleUrl: './blog-post-list.component.scss',
})
export class BlogPostListComponent implements OnInit {
  blogPostService = inject(BlogPostService);
  destroy$ = destroyNotifier();
  blogPosts?: BlogPost[];

  ngOnInit(): void {
    this.blogPostService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.blogPosts = response;
      });
  }
}
