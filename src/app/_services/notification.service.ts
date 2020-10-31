import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';

export interface Message {
  username: string;
  message: string;
  timeSent: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  url = 'ws://localhost:3000';
  webSocket: WebSocket;
  messages: Message[] = [];
  token;

  constructor(
    private authentication: AuthenticationService
  ) {
    this.token = this.authentication.token;
  }

  public openWebSocket() {

    this.webSocket = new WebSocket('ws://localhost:3000', this.token);
    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      this.messages.push(JSON.parse(event.data));
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };

  }

  public sendMessage(message: Message) {
    this.webSocket.send(JSON.stringify(message));
  }

  public closeConnection() {
    this.webSocket.close();
  }

}

