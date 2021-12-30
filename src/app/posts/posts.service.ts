import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'
@Injectable({providedIn: 'root'})
export class PostsService{
  private posts:Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient.get<any>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      });
    }))
    .subscribe((transformedPosts)=>{
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts])
    })
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const newPost: Post = {id: null, title: title, content: content}

    this.httpClient.post<{messeage: string, postId: string}>('http://localhost:3000/api/posts', newPost)
    .subscribe(data=>{
      newPost.id = data.postId
      this.posts.push(newPost)
      this.postsUpdated.next([...this.posts])
    })
  }

  deletePost(id: string) {
    this.httpClient.delete<{id: string}>('http://localhost:3000/api/posts/' + id)
    .subscribe(()=>{
      const updatedPosts = this.posts.filter(posts => posts.id !== id)
      this.posts = updatedPosts
      this.postsUpdated.next([...this.posts])
    })
  }
}
