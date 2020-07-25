import { RegisterComponent } from './register/register.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'chat',
    component: ChatComponent,
    children: [
      { path: 'room/:roomId', component: ChatRoomComponent },
      { path: 'lobby', component: LobbyComponent },
      { path: '', redirectTo: 'lobby', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
