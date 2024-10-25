import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../../../services/chats.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css'
})
export class ChatsListComponent implements OnInit {
  constructor (public chatsService: ChatsService) {}

  ngOnInit(): void {
    this.chatsService.getAll().subscribe({
      error: e => this.errorHandler(e)
    })
  }

  errorHandler(e: any) {
    console.log(e)
  }
}
