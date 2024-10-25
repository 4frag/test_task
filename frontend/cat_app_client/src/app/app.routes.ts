import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { authGuard } from './auth/auth.guard';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HomeComponent } from './pages/home/home.component';
import { MessagesScreenComponent } from './pages/home/screens/messages-screen/messages-screen.component';


export const appRoutes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},

  {path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)},
  
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
]
