import { Room } from './../../models/room';
import { Message } from './../../models/message';
import { Observable, observable } from 'rxjs';
import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { User } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: io.SocketIOClient.Socket;
  private url = 'http://localhost:4000';

  constructor() {}

  onConnect(): Observable<User[]> {
    return new Observable<User[]>((observer) => {
      this.socket.on('is_online', (users: User[]) => {
        observer.next(users);
      });
    });
  }

  onMessage(): Observable<Message> {
    return new Observable<Message>((observer) => {
      this.socket.on('message', (message: Message) => {
        observer.next(message);
      });
    });
  }

  onCreateRoom(): Observable<Room> {
    return new Observable<Room>((observer) => {
      this.socket.on('new_room', (room: Room) => {
        observer.next(room);
      });
    });
  }

  createRoom(room: Room): void {
    this.socket.emit('new_room', room);
  }

  send(message: Message): void {
    this.socket.emit('message', message);
  }

  connect(userId: number) {
    this.socket = io(`${this.url}/?userId=${userId}`);
  }

  enterRoom(roomId: number): void {
    this.socket.emit('enter_room', roomId);
  }

  leftRoom() {
    this.socket.emit('left_room');
  }
}
