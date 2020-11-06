import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';

export interface Message {
  messageType: string;
  messageBody: MessageBody | number;
}

export interface MessageBody {
  notificationID: number;
  recipients: string[];
  username: string;
  subject: string;
  message: string;
  timeSent: Date;
  received: boolean;
  sent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  url = 'ws://localhost:3000';
  webSocket: WebSocket;
  messages: MessageBody[] = [];
  token;

  connected = true;

  constructor(
    private authentication: AuthenticationService
  ) {
    this.token = this.authentication.token;
  }

  public openWebSocket() {

    this.webSocket = new WebSocket('ws://localhost:3000', this.token);
    this.webSocket.onopen = (event) => {
      this.connected = true;
    };

    this.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.messageType === 'notification') {
        message.messageBody.sent = true;
        this.messages.unshift(message.messageBody);
        this.acknowledgement(message.messageBody.notificationID);
      } else {
      }
    };

    this.webSocket.onerror = (error) => {
      if (this.webSocket.readyState === 1) {
        console.log(error);
      }
    };

    this.webSocket.onclose = (event) => {
      this.connected = false;
      setTimeout(() => this.openWebSocket(), 2000);
    };

  }

  public sendMessage(message: MessageBody) {
    const msg: Message = {
      messageType: 'notification',
      messageBody: message
    };
    this.messages.unshift(message);
    if (this.connected) {
      message.sent = true;
      this.webSocket.send(JSON.stringify(msg));
    }
    console.log(message);
  }

  private acknowledgement(messageID: number) {
    const acknowledgement: Message = {
      messageType: 'acknowledgement',
      messageBody: messageID
    };
    console.log(JSON.stringify(acknowledgement));
    this.webSocket.send(JSON.stringify(acknowledgement));
  }

  public closeConnection() {
    this.webSocket.close();
  }

  get username() {
    return this.authentication.details.username;
  }

}

