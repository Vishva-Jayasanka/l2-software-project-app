import {ElementRef} from '@angular/core';
import {AbstractControl} from '@angular/forms';

// export const YEARS = [2020,2019,2018,2017, 2016 ];
export const YEARS = [
  {id: 0, value: '2021'},
  {id: 1, value: '2020'},
  {id: 2, value: '2019'},
  {id: 3, value: '2018'},
  {id: 4, value: '2017'},
  {id: 5, value: '2016'}
];

export function glow(elementRef: ElementRef, id: string, color: string) {
  elementRef.nativeElement.querySelector('#' + id).style.boxShadow = '0 0 0 2px ' + color;
  setTimeout(
    () => elementRef.nativeElement.querySelector('#' + id).style.boxShadow = '0 0 0 2px white',
    2000
  );
}

export function PasswordValidator(control: AbstractControl): {[key: string]: boolean} | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ?
    {mismatch: true} : null;
}

export function scrollToFirstInvalidElement(elementRef: ElementRef) {
  const firstInvalidControl: HTMLElement = elementRef.nativeElement.querySelector('form .ng-invalid');
  firstInvalidControl.scrollIntoView({behavior: 'smooth'});
}

export function getSemester(val) {
  return 'Level ' + (Math.floor(val / 2) + 1) + ' Semester ' + (val % 2 + 1);
}

export function filter(object: {}, value: string, attribute1: string, attribute2: string): {} {
  const temp = {};
  const filterValue = value.toLowerCase();
  if (value !== '') {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        temp[key] = object[key].filter(module =>
          module[attribute1].toLowerCase().includes(filterValue) || module[attribute2].toLowerCase().includes(filterValue));
      }
    }
    return temp;
  } else {
    return object;
  }
}
