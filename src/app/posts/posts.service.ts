import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from 'rxjs'

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts:Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  
  getPosts() {
    return [...this.posts];
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    const newPost: Post = {title: post.title, content:post.content}
    this.posts.push(newPost)
    this.postsUpdated.next([...this.posts])
  }
}
