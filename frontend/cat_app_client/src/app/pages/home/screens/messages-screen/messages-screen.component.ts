import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages-screen',
  templateUrl: './messages-screen.component.html',
  styleUrl: './messages-screen.component.css'
})
export class MessagesScreenComponent {
  chatId: number | null = null

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('chatId')) {
        this.chatId = Number(params.get('chatId'));
      } 
    })
  }
}
