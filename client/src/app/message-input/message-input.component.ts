import { User } from './../core/models/user';
import { Message } from './../core/models/message';
import { SocketService } from './../core/services/socket/socket.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css'],
})
export class MessageInputComponent implements OnInit {
  @Input() user: User;
  @Input() roomId: number;
  submitted: boolean = false;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {}

  onSend(content) {
    this.submitted = true;

    const message: Message = {
      roomId: this.roomId,
      userId: this.user.userId,
      nickname: this.user.nickname,
      text: content,
    };
    this.socketService.send(message);
  }
}
