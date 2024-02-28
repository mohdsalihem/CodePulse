import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { BlogPostService } from '../../admin/blog-post/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../admin/blog-post/models/blog-post';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  blogPostService = inject(BlogPostService);

  blogs$?: Observable<BlogPost[]>;

  ngOnInit(): void {
    this.blogs$ = this.blogPostService.getAll();
  }
}
