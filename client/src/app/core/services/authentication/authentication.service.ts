import { SocketService } from './../socket/socket.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private url: string = 'http://localhost:3000/users';
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email) {
    return this.http
      .post<User>(`${this.url}/login`, { email })
      .pipe(
        map((user) => {
          this.connectToChat(user);
          return user;
        })
      );
  }

  private connectToChat(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.socketService.connect(user.userId);
  }

  register(user: User) {
    return this.http.post<User>(`${this.url}/register`, user).pipe(
      map((user) => {
        this.connectToChat(user);
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
