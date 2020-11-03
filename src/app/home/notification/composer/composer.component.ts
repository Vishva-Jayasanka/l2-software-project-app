import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {UserDataService} from '../../../_services/user-data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {DataService} from '../../../_services/data.service';
import {YEARS} from '../../../_services/shared.service';

export interface Recipient {
  username: string;
  nameWithInitials: string;
}

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.css']
})
export class ComposerComponent implements OnInit {

  notification: FormGroup;
  separatorCodes: number[] = [ENTER, COMMA, TAB];
  filteredRecipients: Observable<Recipient[]>;
  recipients: Recipient[] = [];
  allRecipients: Recipient[] = [];

  composerProgress = false;
  invalidRecipient = false;

  @ViewChild('recipientInput') recipientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public userData: UserDataService,
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
  }

  ngOnInit(): void {
    for (const year of YEARS) {
      this.allRecipients.push({
        username: 'B' + year.toString().substring(2, 4),
        nameWithInitials: 'Batch ' + year.toString().substring(2, 4)
      });
    }
    this.composerProgress = true;
    this.data.getStudents().subscribe(
      response => {
        this.allRecipients = this.allRecipients.concat(response.students)
          .sort((value1, value2) => value1.username.localeCompare(value2.username));
      },
      error => console.log(error)
    ).add(() => this.composerProgress = false);
    this.notification = this.formBuilder.group({
      recipients: [''],
      subject: [''],
      message: ['']
    });
    this.filteredRecipients = this.notification.get('recipients').valueChanges.pipe(
      startWith(null),
      map((recipient: string | null) => recipient ? this._filter(recipient) : this.allRecipients.slice())
    );
  }

  sendNotification() {
  }

  add(event: MatChipInputEvent): void {
    this.invalidRecipient = false;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      const recipient = this.allRecipients.find(recip => recip.username === value.trim());
      if (recipient) {
        this.recipients.push(recipient);
      } else {
        this.invalidRecipient = true;
      }
    }
    if (input) {
      input.value = '';
    }
    this.recipientsControl.setValue(null);
  }

  remove(value: string): void {
    const index = this.recipients.indexOf(this.allRecipients.find(recipient => recipient.username === value));
    if (index >= 0) {
      this.recipients.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.recipients.push(this.allRecipients.find(recipient => recipient.username === event.option.value));
    this.recipientInput.nativeElement.value = '';
    this.recipientsControl.setValue(null);
  }

  private _filter(value: string): Recipient[] {
    value = value.toLowerCase();
    return this.allRecipients
      .filter(recipient => recipient.nameWithInitials.toLowerCase().includes(value) || recipient.username.toLowerCase().includes(value));
  }

  get recipientsControl() {
    return this.notification.get('recipients');
  }

  get subject() {
    return this.notification.get('subject');
  }

  get message() {
    return this.notification.get('message');
  }

}
