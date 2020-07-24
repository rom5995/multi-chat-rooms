import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Room, Message } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http
      .get<Room[]>('http://localhost:4000')
      .pipe(catchError(this.handleError<Room[]>('getRooms', [])));
  }

  getRoomHistory(id: number): Observable<Message[]> {
    const url = `http://localhost:4000/getRoomHistory/${id}`;
    return this.http
      .get<Message[]>(url)
      .pipe(catchError(this.handleError<Message[]>('getRoomHistory', [])));
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
