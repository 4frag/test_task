import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ]
})
export class LoginFormComponent {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })

  isButtonDisabled = true;

  constructor (private auth: AuthService, private router: Router) {}

  handleClick() {
    if (this.loginForm.value.password && this.loginForm.value.username) {
      this.auth.login(this.loginForm.value.username, this.loginForm.value.password);
    }
  }

  handleInput() {
    const data = this.loginForm.value;

    if (data.username != '' && data.password != '') {
      this.isButtonDisabled = false;
    } else {
      this.isButtonDisabled = true;
    }
  }
}
