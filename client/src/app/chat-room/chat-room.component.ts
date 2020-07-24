import { User } from './../core/models/user';
import { AuthenticationService } from './../core/services/authentication/authentication.service';
import { SocketService } from './../core/services/socket/socket.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoomService } from './../core/services/room/room.service';
import { Room, Message } from './../core/models';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit {
  roomId: number;
  messages: Message[];
  user: User;
  onlineUsers: User[] = [];

  private _onlineSubscribtion;
  private _messagesSubscribtion;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private socketService: SocketService,
    private authenticationService: AuthenticationService
  ) {
    this.roomId = +this.route.snapshot.paramMap.get('roomId');
    this.user = this.authenticationService.currentUserValue;

    this.socketService.enterRoom(this.user.userId, this.roomId);
    this._onlineSubscribtion = this.socketService
      .onConnect()
      .subscribe((users: User[]) => {
        this.onlineUsers = users;
      });
    this._messagesSubscribtion = this.socketService
      .onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });
  }

  ngOnInit(): void {
    this.getRoomHistory();
  }

  getRoomHistory(): void {
    this.roomService
      .getRoomHistory(this.roomId)
      .subscribe((messages: Message[]) => (this.messages = messages));
  }
}
