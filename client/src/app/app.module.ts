import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MessageInputComponent } from './message-input/message-input.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, ChatComponent, RoomsComponent, ChatRoomComponent, LobbyComponent, MessageInputComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
