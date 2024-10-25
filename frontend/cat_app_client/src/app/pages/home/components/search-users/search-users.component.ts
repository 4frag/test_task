import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchUsersService } from '../../../../services/search-users.service';
import { IUser } from '../../../../data/user';
import { ChatsService } from '../../../../services/chats.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.css'
})
export class SearchUsersComponent {
  @ViewChild('search', { read: ViewContainerRef }) searchLine: ViewContainerRef

  query = new FormControl('')
  results: IUser[] = []
  isSearch: boolean = false

  constructor (
    private elementRef: ElementRef, 
    private searchUsersService: SearchUsersService, 
    private chatsService: ChatsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.addEventListener('submit', (e: MessageEvent) => {
      e.preventDefault()
      if (this.query.value) {
        this.searchUsersService.search(this.query.value).subscribe({
          next: data => {
            this.results = data
            this.isSearch = true
          },
          error: e => this.errorHandler(e)
        })
      }
    })
  }

  getOrCreateChat(user_id: number) {
    this.chatsService.getOrCreate(user_id).subscribe({
      next: response => this.router.navigateByUrl('/home/messages/' + response.chat_id)
    })
  }

  errorHandler(error: Error) {
    console.log(error)
  }
}
