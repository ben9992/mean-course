import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from './auth-data.model'
@Injectable({providedIn: 'root'})
export class AuthService{
  private token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>()

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken(){
    return this.token
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(data=>{
      this.router.navigate(["/"])
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post<{token: string}>('http://localhost:3000/api/user/login', authData)
    .subscribe(data=>{
      this.token = data.token
      if(this.token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true)
        this.router.navigate(["/"])
      }
    })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"])
  }
}
