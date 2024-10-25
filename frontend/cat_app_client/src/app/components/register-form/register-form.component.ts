import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ]
})
export class RegisterFormComponent {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    password_check: new FormControl(''),
  })

  isButtonDisabled = true;

  constructor (private auth: AuthService, private router: Router) {}

  handleClick() {
    const data = this.loginForm.value;

    if (data.password && data.username && data.password_check === data.password) {
      this.auth.register(data.username, data.password);
    } else if (data.password_check != data.password) {
      alert('Пароли не совпадают');
      this.loginForm.patchValue({password: '', password_check: ''})
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
