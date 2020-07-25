import { SocketService } from './../socket/socket.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Room, Message } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private url: string = 'http://localhost:4000/rooms';
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getRooms(): Observable<Room[]> {
    return this.http
      .get<Room[]>(this.url)
      .pipe(catchError(this.handleError<Room[]>('getRooms', [])));
  }

  getRoomHistory(id: number): Observable<any> {
    const url = `${this.url}/getRoomHistory/${id}`;
    return this.http
      .get<Message[]>(url)
      .pipe(catchError(this.handleError<any>('getRoomHistory', [])));
  }

  createNewRoom(room: Room) {
    return this.http.post<any>(`${this.url}/createNewRoom`, room).pipe(
      map((newRoom) => {
        this.socketService.createRoom(newRoom);
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
