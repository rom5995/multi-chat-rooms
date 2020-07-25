import { User } from './../core/models/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css'],
})
export class OnlineUsersComponent implements OnInit {
  @Input() onlineUsers: User[] = [];
  isUsersListVisible: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
