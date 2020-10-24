import {Component, KeyValueDiffers, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from "../../_services/data.service";

export interface Course {
  courseID: number;
  courseName: string;
}

export interface District {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  name: string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  maxDate: Date = new Date();
  courses: Course[] = [
    {courseID: 1, courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY'},
    {courseID: 2, courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY'},
  ];
  districts: District[] = [
    {code: 'D1', name: 'Ampara'},
    {code: 'D2', name: 'Anuradhapura'},
    {code: 'D3', name: 'Badulla'},
    {code: 'D4', name: 'Batticaloa'}
  ];
  provinces: Province[] = [
    {code: 'CP', name: 'Central Province'},
    {code: 'NP', name: 'Northern Province'},
    {code: 'NC', name: 'North Central Province'},
    {code: 'EP', name: 'Eastern Province'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      courseName: ['', [Validators.required]],
      name: this.formBuilder.group({
        fullName: ['', [Validators.required]],
        nameWithInitials: ['', [Validators.required]],
      }),
      address: this.formBuilder.group({
        permanentAddress: ['', [Validators.required]],
        district: ['', [Validators.required]],
        province: ['', [Validators.required]],
      }),
      dateOfBirth: ['', [Validators.required]],
      race: ['', [Validators.required]],
      religion: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      nic: ['', [Validators.required, Validators.pattern(/^([0-9]{12})|([0-9]{9}[A-Za-z])/)]],
      contactDetails: this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
        mobile: ['', [Validators.required, Validators.pattern(/^(0[1-9][0-9]{8})|(\+94[1-9][0-9]{8})$/)]],
        home: ['', [Validators.required, Validators.pattern(/^(0[1-9][0-9]{8})|(\+94[1-9][0-9]{8})$/)]]
      }),
      employment: this.formBuilder.group({
        designation: [''],
        employer: [''],
        company: ['']
      }),
      educationQualifications: this.formBuilder.array([]),
      registration: this.formBuilder.group({
        registrationFees: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        dateOfPayment: ['', [Validators.required]]
      })
    });
    this.addQualification();
  }

  addQualification() {
    this.educationQualifications.push(
      this.formBuilder.group({
        degree: ['', [Validators.required]],
        institute: ['', [Validators.required]],
        graduationDate: ['', Validators.required],
        grade: ['', [Validators.required]]
      })
    );
  }

  submitForm() {
    this.data.registerStudent(this.registrationForm.value).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
  }

  removeQualification(i: number) {
    this.educationQualifications.controls.splice(i, i + 1);
  }

  get courseName() {
    return this.registrationForm.get('courseName');
  }

  get fullName() {
    return this.registrationForm.get('name').get('fullName');
  }

  get nameWithInitials() {
    return this.registrationForm.get('name').get('nameWithInitials');
  }

  get permanentAddress() {
    return this.registrationForm.get('address').get('permanentAddress');
  }

  get district() {
    return this.registrationForm.get('address').get('district');
  }

  get province() {
    return this.registrationForm.get('address').get('province');
  }

  get dateOfBirth() {
    return this.registrationForm.get('dateOfBirth');
  }

  get race() {
    return this.registrationForm.get('race');
  }

  get religion() {
    return this.registrationForm.get('religion');
  }

  get gender() {
    return this.registrationForm.get('gender');
  }

  get nic() {
    return this.registrationForm.get('nic');
  }

  get email() {
    return this.registrationForm.get('contactDetails').get('email');
  }

  get mobile() {
    return this.registrationForm.get('contactDetails').get('mobile');
  }

  get home() {
    return this.registrationForm.get('contactDetails').get('home');
  }

  get designation() {
    return this.registrationForm.get('employment').get('designation');
  }

  get employer() {
    return this.registrationForm.get('employment').get('employer');
  }

  get company() {
    return this.registrationForm.get('employment').get('company');
  }

  get registrationFees() {
    return this.registrationForm.get('registration').get('registrationFees');
  }

  get dateOfPayment() {
    return this.registrationForm.get('registration').get('dateOfPayment');
  }

  get educationQualifications(): FormArray {
    return this.registrationForm.get('educationQualifications') as FormArray;
  }

}
