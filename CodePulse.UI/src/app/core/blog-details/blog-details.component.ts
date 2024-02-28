import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { destroyNotifier } from '../helpers/destroyNotifier';
import { Observable, of, switchMap, takeUntil } from 'rxjs';
import { BlogPostService } from '../../admin/blog-post/blog-post.service';
import { BlogPost } from '../../admin/blog-post/models/blog-post';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  blogPostService = inject(BlogPostService);
  destroy$ = destroyNotifier();

  url: string | null = null;
  blogPost$?: Observable<BlogPost>;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        this.url = params.get('url');
        if (this.url) {
          this.blogPost$ = this.blogPostService.getByUrlHandle(this.url);
        }
      },
    });
  }
}
