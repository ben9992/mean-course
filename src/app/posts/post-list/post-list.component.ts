import { Component, OnDestroy, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postsSub: Subscription;
  isLoading = false
  totalPosts = 10
  postsPerPage = 2;
  currentPage = 1
  pageSizeOptions = [1, 2, 5, 10]
  constructor(public postService: PostsService) {}
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true
    this.postService.getPosts(this.postsPerPage, 1);
    this.postsSub = this.postService.getPostsUpdatedListener()
    .subscribe((postdata: {posts: Post[], postsCount: number}) => {
      this.posts = postdata.posts;
      this.totalPosts = postdata.postsCount
      this.isLoading = false
    })
  }

  onDelete(id: string) {
    this.isLoading = true
    this.postService.deletePost(id)
    .subscribe(() => this.postService.getPosts(this.postsPerPage, this.currentPage));
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

 posts: Post[] = []

}
