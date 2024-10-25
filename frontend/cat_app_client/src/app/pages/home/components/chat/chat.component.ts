import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from '../../../../services/messages.service';
import { IChat } from '../../../../data/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() chatId: number
  chatInfo: IChat | null = null
  messageGroup = new FormGroup({
    message: new FormControl(''),
  })

  constructor (public messagesService: MessageService) {}

  ngOnInit(): void {
    this.messagesService.connect()
    this.messagesService.getAllFromChat(this.chatId)
  }

  ngOnDestroy(): void {
    this.messagesService.disconnect()
  }

  sendMessage() {
    const text = this.messageGroup.controls['message'].value
    if (text) {
      this.messagesService.send(text, this.chatId)
      this.messageGroup.reset()
    }
  }
}
