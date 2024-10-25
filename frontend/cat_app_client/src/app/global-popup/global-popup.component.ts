import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-global-popup',
  templateUrl: './global-popup.component.html',
  styleUrls: ['./global-popup.component.css'],
  standalone: true,
  imports: []
})
export class GlobalPopupComponent implements AfterViewInit {
  @ViewChild('globalPopup', { read: ViewContainerRef }) popupContainer: ViewContainerRef;

  constructor (private popupService: PopupService) {}

  ngAfterViewInit() {
    this.popupService.component.subscribe({
      next: (comp) => {
        this.popupContainer.clear();
        if (comp) {
          this.popupContainer.createComponent(comp);
        }
      }
    })
  }
}
