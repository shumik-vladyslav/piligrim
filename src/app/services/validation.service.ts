import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
}

export function emailValidator(): ValidatorFn {
  const regExp: RegExp = /^\S+@\S+\.\S+$/;
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (control.value) {
      const uncorrectEmail = !regExp.test(control.value);
      return uncorrectEmail ? {uncorrectEmail: {value: control.value}} : null;
    } else {
      return null;
    }
  };
}

export function phoneValidator(): ValidatorFn {
  const regExp: RegExp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  return (control: AbstractControl): {[key: string]: any} | null => {

    if (control.value) {
      const uncorrectPhone = !regExp.test(control.value);
      return uncorrectPhone ? {uncorrectPhone: {value: control.value}} : null;
    } else {
      return null;
    }
  };
}

