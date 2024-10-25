import { Injectable } from '@angular/core';
import { Observable, tap, retry, catchError, throwError, EMPTY } from 'rxjs';
import { ICat } from '../data/cat';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CatsService {
  cats: ICat[] = [];

  constructor(
    private http: HttpClient, 
    private auth: AuthService
  ) { }

  getAll(): Observable<ICat[]> | null {
    this.auth.checkAuth();

    return this.http.get<ICat[]>(this.auth.host + 'cats').pipe(
      tap(cats => this.cats = cats)
    )
  }

  create(data: object) {
    this.auth.checkAuth();

    return this.http.post(this.auth.host + 'cats/', data, {
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': this.auth.getCsrfToken()}
    })
  }

  put(data: object, catId: number) {
    this.auth.checkAuth()

    return this.http.put(this.auth.host + `cats/${catId}`, data, {
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': this.auth.getCsrfToken()}
    })
  }

  delete(catId: number) {
    this.auth.checkAuth()

    return this.http.delete(this.auth.host + `cats/${catId}/`, {headers: {'X-CSRFToken': this.auth.getCsrfToken()}})
  }

  getCatInfo(catId: number | undefined) {
    this.auth.checkAuth()

    return this.http.get<ICat>(this.auth.host + `cats/${catId}/`)
  }
}
