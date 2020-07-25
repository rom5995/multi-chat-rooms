import { SocketService } from './core/services/socket/socket.service';
import { Router } from '@angular/router';
import { User } from './core/models/user';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Chat Rooms';
  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private socketService: SocketService
  ) {
    this.authenticationService.currentUser.subscribe(
      (user) => (this.currentUser = user)
    );
    if (this.currentUser) {
      this.socketService.connect(this.currentUser.userId);
      this.router.navigate(['/chat']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
