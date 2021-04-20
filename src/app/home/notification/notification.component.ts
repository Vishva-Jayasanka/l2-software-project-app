import {Component, DoCheck, ElementRef, EventEmitter, IterableDiffers, OnDestroy, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../_services/notification.service';
import {FormBuilder} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication.service';
import {UserDataService} from '../../_services/user-data.service';
import {DataService} from '../../_services/data.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy, DoCheck {

  differ: any;

  @Output() newNotifications = new EventEmitter<number>();

  constructor(
    public notification: NotificationService,
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService,
    public userData: UserDataService,
    private data: DataService,
    private differs: IterableDiffers,
    private snackBar: MatSnackBar
  ) {
    this.differ = differs.find(this.notification.messages).create(null);
  }

  ngDoCheck() {
    this.newNotifications.emit(this.notification.messages.filter(message => !message.received && message.sent).length);
  }

  ngOnInit(): void {
    this.notification.openWebSocket();
    this.data.getNotifications().subscribe(
      response => {
        this.notification.messages = response.notifications.map(notification => {
          return {
            notificationID: notification.notificationID,
            recipients: [],
            username: notification.sentBy,
            subject: notification.subject,
            message: notification.message,
            timeSent: new Date(notification.timeSent),
            received: notification.received,
            sent: true
          };
        });
        this.notification.messages.sort((t1, t2) => t1 > t2 ? 1 : -1);
        const received: string[] = response.notifications.filter(notification => !notification.received)
          .map(notification => notification.notificationID);
        if (received.length !== 0) {
          this.data.updateNotificationStatus(received).subscribe();
        }
      },
      error => console.log(error)
    );
  }

  deleteMessage(i: number): void {
    console.log(this.notification.messages[i]);
    if (confirm('Are you sure, you want to delete this message?')) {
      if (this.notification.messages[i].sent) {
        this.data.deleteMessage(this.notification.messages[i].notificationID).subscribe(
          response => {
            this.notification.messages.splice(i, i + 1);
            this.snackBar.open('Message deleted', 'Close', {
              duration: 3000
            });
          }, error => {
            this.snackBar.open('Could not delete the message', 'Close', {
              duration: 3000
            });
          }
        );
      } else {
        this.notification.messages.splice(i, i + 1);
      }
    }
  }

  sendAgain(i: number): void {
    const message = this.notification.messages[i];
    this.notification.messages.splice(i, i + 1);
    this.notification.sendMessage(message);
  }

  ngOnDestroy() {
    this.notification.closeConnection();
  }

  get getRole() {
    return this.authentication.details.role;
  }

  get username() {
    return this.authentication.details.username;
  }

  get fullName() {
    const details = this.authentication.details;
    return details.firstName + ' ' + details.lastName;
  }

}
