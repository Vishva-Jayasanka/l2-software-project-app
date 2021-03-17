import {Component, ElementRef, KeyValueDiffers, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../_services/data.service';
import {YEARS} from '../../_services/shared.service';

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

export const COURSES: Course[] = [
  {courseID: 1, courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY'},
  {courseID: 2, courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY'},
];

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  registerStudentProgress = false;
  maxDate: Date = new Date();
  courses: Course[] = COURSES;
  years = YEARS;

  success = false;
  error = '';

  districts: District[] = [
    {code: 'LK-52', name: 'Ampara'},
    {code: 'LK-71', name: 'Anuradhapura'},
    {code: 'LK-81', name: 'Badulla'},
    {code: 'LK-51', name: 'Batticaloa'},
    {code: 'LK-11', name: 'Colombo'},
    {code: 'LK-31', name: 'Galle'},
    {code: 'LK-12', name: 'Gampaha'},
    {code: 'LK-33', name: 'Hambantota'},
    {code: 'LK-41', name: 'Jaffna'},
    {code: 'LK-13', name: 'Kalutara'},
    {code: 'LK-21', name: 'Kandy'},
    {code: 'LK-92', name: 'Kegalle'},
    {code: 'LK-42', name: 'Kilinochchi'},
    {code: 'LK-61', name: 'Kurunegala'},
    {code: 'LK-43', name: 'Mannar'},
    {code: 'LK-22', name: 'Matale'},
    {code: 'LK-32', name: 'Matara'},
    {code: 'LK-82', name: 'Monaragala'},
    {code: 'LK-45', name: 'Mulativu'},
    {code: 'LK-23', name: 'Nuwara Eliya'},
    {code: 'LK-72', name: 'Polonnaruwa'},
    {code: 'LK-62', name: 'Puttalam'},
    {code: 'LK-91', name: 'Ratnapura'},
    {code: 'LK-53', name: 'Trincomalee'},
    {code: 'LK-44', name: 'Vavuniya'}
  ];
  provinces: Province[] = [
    {code: 'LK-2', name: 'Central Province'},
    {code: 'LK-5', name: 'Eastern Province'},
    {code: 'LK-7', name: 'North Central Province'},
    {code: 'LK-6', name: 'North Western Province'},
    {code: 'LK-4', name: 'Northern Province'},
    {code: 'LK-9', name: 'Sabaragamuwa Province'},
    {code: 'LK-3', name: 'Southern Province'},
    {code: 'LK-8', name: 'Uva Province'},
    {code: 'LK-1', name: 'Western Province'},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      courseName: [1, [Validators.required]],
      academicYear: ['', [Validators.required]],
      name: this.formBuilder.group({
        fullName: ['Atapattu Kuruppuge Vishwa Jayasanka', [Validators.required]],
        nameWithInitials: ['A.K.V Jayasnaka', [Validators.required]],
      }),
      address: this.formBuilder.group({
        permanentAddress: ['Ihalagewatta, Naimana South, Matara', [Validators.required]],
        district: ['LK-32', [Validators.required]],
        province: ['LK-3', [Validators.required]],
      }),
      dateOfBirth: ['1998-01-09', [Validators.required]],
      race: ['Sinhalees', [Validators.required]],
      religion: ['Buddhist', [Validators.required]],
      gender: ['M', [Validators.required]],
      nic: ['199800910054', [Validators.required, Validators.pattern(/^([0-9]{12})|([0-9]{9}[A-Za-z])/)]],
      contactDetails: this.formBuilder.group({
        email: ['vishvajayasanka@gmail.com', [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
        mobile: ['+94719251862', [Validators.required, Validators.pattern(/^(0[1-9][0-9]{8})|(\+94[1-9][0-9]{8})$/)]],
        home: ['+94418889637', [Validators.required, Validators.pattern(/^(0[1-9][0-9]{8})|(\+94[1-9][0-9]{8})$/)]]
      }),
      employment: this.formBuilder.group({
        designation: ['Software Engineer'],
        employer: ['Saman Kumara'],
        company: ['ABC Holdings']
      }),
      educationQualifications: this.formBuilder.array([]),
      registration: this.formBuilder.group({
        registrationFees: ['200', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        registrationFeesPaid: [false],
        dateOfPayment: ['2020-02-05', [Validators.required]]
      })
    });
    this.addQualification();
  }

  addQualification() {
    this.educationQualifications.push(
      this.formBuilder.group({
        degree: ['Bsc. Eng', [Validators.required]],
        institute: ['University of Moratuwa', [Validators.required]],
        graduationDate: ['2019-08-15', Validators.required],
        grade: ['Second Upper', [Validators.required]]
      })
    );
  }

  submitForm() {
    this.registerStudentProgress = true;
    if (this.registrationForm.valid) {
      this.data.registerStudent(this.registrationForm.value).subscribe(
        response => {
          this.success = true;
          this.error = '';
          this.registrationForm.reset();
        },
        error => {
          this.success = false;
          this.error = error;
        }
      ).add(() => this.registerStudentProgress = false);
    } else {
      this.registerStudentProgress = false;
      this.scrollToFirstInvalidControl();
    }
  }

  toggleRegistrationFeesPaid() {
    console.log(!this.registrationFeesPaid.value);
    this.registrationFeesPaid.setValue(!this.registrationFeesPaid.value);
    console.log(this.registrationFeesPaid.value);
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector('form .ng-invalid');
    firstInvalidControl.scrollIntoView({behavior: 'smooth'});
  }

  resetForm() {
    this.registrationForm.reset();
    this.elementRef.nativeElement.querySelector('#course-name').scrollIntoView();
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

  get registrationFeesPaid() {
    return this.registrationForm.get('registration').get('registrationFeesPaid');
  }

  get educationQualifications(): FormArray {
    return this.registrationForm.get('educationQualifications') as FormArray;
  }

}
