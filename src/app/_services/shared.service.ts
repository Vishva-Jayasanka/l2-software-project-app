import {ElementRef} from '@angular/core';

export const YEARS = [2016, 2017, 2018, 2019, 2020];

export function glow(elementRef: ElementRef, id: string, color: string) {
  elementRef.nativeElement.querySelector('#' + id).style.boxShadow = '0 0 0 2px ' + color;
  setTimeout(
    () => elementRef.nativeElement.querySelector('#' + id).style.boxShadow = '0 0 0 2px white',
    2000
  );
}
