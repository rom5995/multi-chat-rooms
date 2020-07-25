import { first } from 'rxjs/operators';
import { Room } from './../core/models/room';
import { RoomService } from './../core/services/room/room.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css'],
})
export class CreateRoomComponent implements OnInit {
  constructor(private roomService: RoomService) {}

  ngOnInit(): void {}

  onCreate(roomName: string): void {
    const room: Room = { name: roomName };
    this.roomService
      .createNewRoom(room)
      .pipe(first())
      .subscribe(
        (data) => {},
        (error) => {
          console.log(error);
        }
      );
  }
}
