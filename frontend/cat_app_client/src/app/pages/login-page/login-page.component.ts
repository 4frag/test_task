import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  standalone: true,
  imports: [
    LoginFormComponent
  ]
})
export class LoginPageComponent {}
