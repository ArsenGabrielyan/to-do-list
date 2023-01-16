import { Directive, ElementRef, Renderer2 } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms"

@Directive({
  selector: '[noSpaceValidation]',
  providers:[{
    provide: NG_VALIDATORS,
    useExisting: NoSpaceValidationDirective,
    multi: true
  }]
})
export class NoSpaceValidationDirective implements Validator {
  constructor(private el: ElementRef){}
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    const val = String(control.value);
    if(val.trim() === "") return {hasAnySpaces: true}
    return null
  }
}