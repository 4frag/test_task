import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { IChat } from '../data/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  chats: IChat[] = []

  constructor(private auth: AuthService, private http: HttpClient) {}

  getAll() {
    return this.http.get<IChat[]>(this.auth.host + 'chats/').pipe(
      tap(chats => this.chats = chats)
    )
  }

  getOrCreate(interlocutor_id: number) {
    this.auth.checkAuth()

    return this.http.get<any>(this.auth.host + 'getOrCreateChat/' + interlocutor_id)
  }
}
