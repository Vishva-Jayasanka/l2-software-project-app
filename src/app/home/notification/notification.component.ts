import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Message, NotificationService} from '../../_services/notification.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  scrollHeight = 1;
  messageText: FormControl;
  message: Message;

  constructor(
    public notification: NotificationService,
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.notification.openWebSocket();
    this.messageText = new FormControl('', [Validators.required]);
  }

  ngOnDestroy() {
    this.notification.closeConnection();
  }

  sendMessage() {
    if (this.messageText.valid) {
      this.message = {
        username: this.username,
        message: this.messageText.value,
        timeSent: new Date()
      };
      this.notification.sendMessage(this.message);
      console.log(this.notification.messages);
      this.messageText.setValue('');
    }
  }

  countLineBreaks() {
    const height = (this.elementRef.nativeElement.querySelector('#message1').scrollHeight - 12) / 24;
    this.scrollHeight = height > 4 ? 4 : height;
  }

  get username() {
    return this.authentication.details.username;
  }

  get getRole() {
    return this.authentication.details.role;
  }

}
