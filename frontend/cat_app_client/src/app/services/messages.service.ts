import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { IChat } from '../data/chat';
import { IMessage } from '../data/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private socket: WebSocket | null = null
  chats: IChat[] = []
  messages: IMessage[] = []

  constructor(private auth: AuthService, private http: HttpClient) {}

  getAllFromChat(chat_id: number): void {
    this.http.get<IMessage[]>(this.auth.host + 'messages?chat_id=' + chat_id).subscribe({
      next: data => this.messages = data.reverse(),
      error: e => console.log(e)
    })
  }

  connect() {
    this.auth.checkAuth()

    try {
      this.socket = new WebSocket(window.location.origin + '/ws/chat/')
    } catch (e) {
      alert(e)
      return
    }

    this.socket.onmessage = (e: any) => {
      const data = JSON.parse(e.data)
      this.messages.unshift(data)
    };
  }

  disconnect() {
    this.socket?.close()
  }

  receive(e: MessageEvent) {
    console.log(e)
  }

  send(text: string, chat_id: number) {
    this.socket?.send(JSON.stringify({'chat_id': chat_id, 'text': text}))
  }
}
