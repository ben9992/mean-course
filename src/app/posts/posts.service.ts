import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

const postUrl = environment.baseApiUrl + "/posts/"
@Injectable({providedIn: 'root'})
export class PostsService{
  private posts:Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postsCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.httpClient.get<{posts:any, maxPosts: number}>(postUrl + queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        }
      })
      ,maxPosts: postData.maxPosts
    }
    }))
    .subscribe((transformedPostsData)=>{
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({posts: [...this.posts],
      postsCount:transformedPostsData.maxPosts})
    })
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>('http://localhost:3000/api/posts/' + id)
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.httpClient.post<{messeage: string, post: Post}>(postUrl, postData)
    .subscribe(data=>{
      this.router.navigate(["/"])
    })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData
    if(typeof(image) === 'object') {
      postData = new FormData()
      postData.append("id", id)
      postData.append("title", title)
      postData.append("content", content)
      postData.append("image", image, title)
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this.httpClient.put(postUrl + id, postData)
    .subscribe(response => {
        this.router.navigate(["/"])
      })
  }

  deletePost(id: string) {
    return this.httpClient.delete<{id: string}>(postUrl + id)
  }
}
