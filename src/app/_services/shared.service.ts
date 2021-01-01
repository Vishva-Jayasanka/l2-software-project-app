import {ElementRef} from '@angular/core';

export const YEARS = [2016, 2017, 2018, 2019, 2020];

export function glow(elementRef: ElementRef, id: string, color: string) {
  elementRef.nativeElement.querySelector('#' + id).style.boxShadow = '0 0 0 2px ' + color;
  setTimeout(
    () => elementRef.nativeElement.querySelector('#' + id).style.boxShadow = '0 0 0 2px white',
    2000
  );
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
