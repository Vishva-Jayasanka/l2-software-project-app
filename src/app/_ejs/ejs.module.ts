import {NgModule} from '@angular/core';
import {TooltipModule} from '@syncfusion/ej2-angular-popups';

const ejs = [
  TooltipModule
];

@NgModule({
  imports: [ejs],
  exports: [ejs]
})

export class EjsModule {
}
