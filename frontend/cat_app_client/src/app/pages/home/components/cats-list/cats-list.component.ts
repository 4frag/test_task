import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CatsService } from '../../../../services/cats.service';
import { CreateCatPopupComponent } from '../create-cat-popup/create-cat-popup.component';
import { PopupService } from '../../../../services/popup.service';
import { ICatPopupContext } from '../../../../data/catPopupContext';

@Component({
  selector: 'app-cats-list',
  templateUrl: './cats-list.component.html',
  styleUrl: './cats-list.component.css'
})
export class CatsListComponent implements OnInit {
  @ViewChild('globalPopup', { read: ViewContainerRef, static: true }) popupContainer: ViewContainerRef;
  checkCats: any = null

  constructor(public catsService: CatsService, private popupService: PopupService) {}


  ngOnInit(): void {
    this.fetchCats()
    if (!this.checkCats) {
      this.checkCats = setInterval(() => this.fetchCats(), 10000)
    }
  }

  fetchCats() {
    this.catsService.getAll()?.subscribe({
      error: error => this.errorHandler(error)
    })
  }

  showCatPopup() {
    const context = new ICatPopupContext(false, 'Создать', undefined)

    this.popupService.setPopupComponent(CreateCatPopupComponent, context);
  }  

  errorHandler(error: any) {
    if (error.status === 400) {
      clearInterval(this.checkCats)
    }
  }
}
