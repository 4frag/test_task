import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../auth/auth.service';
import { fakeAsync } from '@angular/core/testing';


@Component({
  selector: 'app-profile-bar',
  templateUrl: './profile-bar.component.html',
  styleUrl: './profile-bar.component.css'
})
export class ProfileBarComponent implements OnInit {
  username: string;
  loading = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.userId) {
      this.loading = true;
      this.auth.request('users/' + this.auth.userId + '/', 'GET').subscribe((data: any) => {
        this.loading = false;
        this.username = data.username;
      });
    }
  }

  logout() {
    this.auth.logout();
  }
}
