import { Injectable } from '@angular/core';
import { CreateCatPopupComponent } from '../pages/home/components/create-cat-popup/create-cat-popup.component';
import { ProfileBarComponent } from '../pages/home/components/profile-bar/profile-bar.component';
import { Subject } from 'rxjs';
import { ICatPopupContext } from '../data/catPopupContext';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  component = new Subject<any>;
  data = new Subject<any>;

  setPopupComponent(component: any, data: any) {
    this.component.next(component);
    this.data.next(data);
  }

  clear() {
    this.component.next(undefined);
  }
}
