import { Component, OnDestroy, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postsSub: Subscription;
  isLoading = false
  constructor(public postService: PostsService) {}
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true
    this.postService.getPosts();
    this.postsSub = this.postService.getPostsUpdatedListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false
    })
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }


 posts: Post[] = []

}
