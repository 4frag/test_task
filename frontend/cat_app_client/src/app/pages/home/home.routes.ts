import { Routes } from "@angular/router";
import { MainScreenComponent } from "./screens/main-screen/main-screen.component";
import { MessagesScreenComponent } from "./screens/messages-screen/messages-screen.component";
import { HomeComponent } from "./home.component";

export const homeRoutes: Routes = [
  {path: '', component: HomeComponent, children: [
    { path: 'messages', component: MessagesScreenComponent },
    { path: 'messages/:chatId', component: MessagesScreenComponent },
    { path: '', component: MainScreenComponent }
  ]},
]