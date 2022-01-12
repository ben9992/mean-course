import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from './auth-data.model'
@Injectable({providedIn: 'root'})
export class AuthService{
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;
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
    this.httpClient.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
    .subscribe(data=>{
      this.token = data.token
      if(this.token) {
        const expiresInDurInMili = data.expiresIn * 1000
        this.createTimer(expiresInDurInMili);
        this.isAuthenticated = true;
        this.authStatusListener.next(true)
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDurInMili)
        this.saveAuthData(this.token, expirationDate)
        this.router.navigate(["/"])
      }
    })
  }

  private createTimer(expiresInDurInMili: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDurInMili);
    console.log(`timer created for: ${expiresInDurInMili}`)
  }

  autoAuthUser() {
    const authInfo = this.getAuthData()

    if(!authInfo)
      return;

    const now = new Date();
    const expiresInDurInMili = authInfo.expirationData.getTime() - now.getTime();

    if(expiresInDurInMili < 0)
      return;

    console.log(authInfo)
    this.token = authInfo.token
    this.createTimer(expiresInDurInMili);
    this.isAuthenticated = true;
    this.authStatusListener.next(true)
  }

  logout() {
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationData = localStorage.getItem('expiration');

    if(!token || !expirationData)
      return

    return {
      token: token,
      expirationData: new Date(expirationData)
    }
  }
}
