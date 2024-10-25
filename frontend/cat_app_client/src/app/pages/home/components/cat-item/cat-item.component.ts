import { Component, Input } from '@angular/core';
import { ICat } from '../../../../data/cat';
import { PopupService } from '../../../../services/popup.service';
import { CreateCatPopupComponent } from '../create-cat-popup/create-cat-popup.component';
import { ICatPopupContext } from '../../../../data/catPopupContext';

@Component({
  selector: 'app-cat-item',
  templateUrl: './cat-item.component.html',
  styleUrl: './cat-item.component.css'
})
export class CatItemComponent {
  @Input() cat: ICat | undefined;

  constructor (private popupService: PopupService) {}

  openEditPopup() {
    const context = new ICatPopupContext(true, 'Сохранить', this.cat?.id)

    this.popupService.setPopupComponent(CreateCatPopupComponent, context);
  }
}
