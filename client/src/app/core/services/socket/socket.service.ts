import { Message } from './../../models/message';
import { Observable } from 'rxjs';
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

  enterRoom(userId: number, roomId: number): void {
    this.socket = io(`${this.url}/?userId=${userId}&roomId=${roomId}`);
  }

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

  send(message: Message): void {
    this.socket.emit('message', message);
  }
}
