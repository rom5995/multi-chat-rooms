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
  roomName: string;
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
    this.user = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      const newRoomId: number = +this.route.snapshot.paramMap.get('roomId');

      if (this.roomId && this.roomId != newRoomId) {
        this.leftRoom();
      }

      this.roomId = newRoomId;
      this.socketService.enterRoom(this.roomId);

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

      this.messages = [];
      this.getRoomHistory();
    });
  }

  private leftRoom(): void {
    this.socketService.leftRoom();

    this._messagesSubscribtion.unsubscribe();
    this._onlineSubscribtion.unsubscribe();
  }

  ngOnDestroy(): void {
    this.leftRoom();
  }

  getRoomHistory(): void {
    this.roomService.getRoomHistory(this.roomId).subscribe((result: any) => {
      this.messages = result.messages;
      this.roomName = result.roomName;
    });
  }
}
