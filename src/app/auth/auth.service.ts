import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthData } from './auth-data.model'

const authApi = environment.baseApiUrl + "/user"

@Injectable({providedIn: 'root'})
export class AuthService{
  private token: string;
  private userId: string;
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

  getUserId() {
    return this.userId
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    return this.httpClient.post(authApi + '/signup/', authData)
    .subscribe({
      next: () => {
        this.login(authData.email, authData.password)
      },
      error: () => this.authStatusListener.next(false)
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post<{token: string, expiresIn: number, userId: string}>(authApi + '/login', authData)
    .subscribe({
      next: data => {
        this.token = data.token
        if(this.token) {
          const expiresInDurInMili = data.expiresIn * 1000
          this.userId = data.userId;
          this.createTimer(expiresInDurInMili);
          this.isAuthenticated = true;
          this.authStatusListener.next(true)
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDurInMili)
          this.saveAuthData(this.token, expirationDate, this.userId)
          this.router.navigate(["/"])
        }
      },
      error: () => this.authStatusListener.next(false)
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

    this.token = authInfo.token
    this.userId = authInfo.userId
    this.createTimer(expiresInDurInMili);
    this.isAuthenticated = true;
    this.authStatusListener.next(true)
  }

  logout() {
    this.token = null;
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/auth/login"]);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationData = localStorage.getItem('expiration');

    if(!token || !expirationData)
      return

    return {
      token: token,
      expirationData: new Date(expirationData),
      userId: userId
    }
  }
}
