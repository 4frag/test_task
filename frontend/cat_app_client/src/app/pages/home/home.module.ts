import { NgModule } from "@angular/core";

import { HomeComponent } from "./home.component";
import { MainScreenComponent } from "./screens/main-screen/main-screen.component";
import { MessagesScreenComponent } from "./screens/messages-screen/messages-screen.component";
import { CatItemComponent } from "./components/cat-item/cat-item.component";
import { CatsListComponent } from "./components/cats-list/cats-list.component";
import { ChatItemComponent } from "./components/chat-item/chat-item.component";
import { ChatsListComponent } from "./components/chats-list/chats-list.component";
import { ProfileBarComponent } from "./components/profile-bar/profile-bar.component";
import { provideRouter, RouterLink, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { CreateCatPopupComponent } from "./components/create-cat-popup/create-cat-popup.component";
import { SearchUsersComponent } from "./components/search-users/search-users.component";
import { homeRoutes } from "./home.routes";
import { ChatComponent } from "./components/chat/chat.component";


@NgModule({
  declarations: [
    HomeComponent,
    
    MainScreenComponent,
    MessagesScreenComponent,

    CatItemComponent,
    CatsListComponent,
    ChatItemComponent,
    ChatsListComponent,
    ProfileBarComponent,
    CreateCatPopupComponent,
    SearchUsersComponent,
    ChatComponent,
  ],
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule
],
  providers: [
    provideRouter(homeRoutes),
  ]
})
export class HomeModule {}