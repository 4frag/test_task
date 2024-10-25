import { Injectable } from '@angular/core';
import { IUser } from '../data/user';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchUsersService {
  constructor(private auth: AuthService, private http: HttpClient) { }

  search(query: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.auth.host + 'users?query=' + query)
  }
}
