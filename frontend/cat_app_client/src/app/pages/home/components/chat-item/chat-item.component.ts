import { Component, Input } from '@angular/core';
import { IChat } from '../../../../data/chat';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.css'
})
export class ChatItemComponent {
  @Input() chat: IChat | undefined
}
