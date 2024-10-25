import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { API_HOST } from "../app.config";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = false;
  public userId = null;
  public host = API_HOST;

  constructor(private http: HttpClient, private router: Router) {
    this.http.get(this.host + 'sessionStatus/').subscribe({
      next: (data: any) => {
        this.isLoggedIn = true;
        this.userId = data.user_id;
        this.router.navigateByUrl('/home');
      },
      error: () => this.router.navigateByUrl('/login')
    })
  }

  public login(username: string, password: string) {
    this.http.post(this.host + 'login/', {
      username: username,
      password: password
    }, {
      headers: {'X-CSRFToken': this.getCsrfToken()}
    }).subscribe({
      next: (data: any) => {
        this.isLoggedIn = true;
        this.userId = data.user_id;
        this.router.navigateByUrl('/home');
      },
      error: error => this.handleError(error)
    })
  }

  public logout() {
    this.http.get(this.host + 'logout/').subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: error => this.handleError(error)
    })
  }

  public register(username: string, password: string) {
    this.http.post(this.host + 'register/', {
      username: username,
      password: password,
    }, {
      headers: {'X-CSRFToken': this.getCsrfToken()}
    }).subscribe({
      next: () => {
        this.isLoggedIn = true;
        this.router.navigateByUrl('/home');
      },
      error: (e) => this.handleError(e)
    })
  }

  private handleError(error: any) {
    let message;
    if (error.status >= 500) {
      message = 'Сервер недоступен';
    } else if (error.status > 400) {
      message = 'Ошибка соединения с сервером. Обратитесь в поддержку';
    } else if (error.status === 400) {
      message = error.error.message;
    }

    alert(message);
  }

  public checkAuth() {
    if (!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
    }
  }

  public request(uri: string, method: string, body: any = undefined) {
    return body ? this.http.request(method, this.host + uri, body) : this.http.request(method, this.host + uri);
  }

  public getCsrfToken() {
    let cookieName = 'csrftoken';
    let decodedCookie = '';
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.startsWith(`${cookieName}=`)) {
              decodedCookie = decodeURIComponent(cookie.substring(cookieName.length + 1));
              return decodedCookie;
          }
      }
  }
    return decodedCookie;
  }
}
