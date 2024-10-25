import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeModule } from './pages/home/home.module';
import { GlobalPopupComponent } from './global-popup/global-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeModule,
    GlobalPopupComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
