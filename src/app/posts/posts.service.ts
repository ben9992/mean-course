import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { ElementSchemaRegistry } from "@angular/compiler";
import { Router } from "@angular/router";
@Injectable({providedIn: 'root'})
export class PostsService{
  private posts:Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

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

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id)
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); //Post = {id: null, title: title, content: content}
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.httpClient.post<{messeage: string, postId: string}>('http://localhost:3000/api/posts', postData)
    .subscribe(data=>{
      const post: Post = {id: data.postId, title: title, content: content}
      post.id = data.postId
      this.posts.push(post)
      this.postsUpdated.next([...this.posts])
      this.router.navigate(["/"])
    })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content}
    this.httpClient.put<{id: string}>('http://localhost:3000/api/posts/' + id, post)
    .subscribe(()=>{
        const updatedPosts = [...this.posts]
        updatedPosts.forEach((element, index) => {
          if(element.id === id) {
              updatedPosts[index] = post;
          }
        });
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
        this.router.navigate(["/"])
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
