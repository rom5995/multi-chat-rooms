import { Room } from './../core/models/room';
import { SocketService } from './../core/services/socket/socket.service';
import { Component, OnInit } from '@angular/core';

import { RoomService } from './../core/services/room/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  rooms: Room[];

  private _roomsSubscribtion;

  constructor(
    private roomService: RoomService,
    private socketService: SocketService
  ) {
    this._roomsSubscribtion = this.socketService
      .onCreateRoom()
      .subscribe((room: Room) => {
        this.rooms.push(room);
      });
  }

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms(): void {
    this.roomService.getRooms().subscribe((rooms) => (this.rooms = rooms));
  }
}
