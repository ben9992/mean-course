import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Subject } from 'rxjs'

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts:Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient.get<Post[]>('http://localhost:3000/api/posts')
    .subscribe((data)=>{
      this.posts = data;
      this.postsUpdated.next([...this.posts])
    })
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const newPost: Post = {id: null, title: title, content: content}
    this.posts.push(newPost)

    this.httpClient.post<{messeage: string}>('http://localhost:3000/api/posts', newPost)
    .subscribe((data)=>{
      console.log(data)
    })

    this.postsUpdated.next([...this.posts])
  }
}
