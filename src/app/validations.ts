import { AbstractControl, ValidatorFn } from "@angular/forms";

 const arabicCharsRegex = /^[ء-ي0-9!@#\$%\^\& *\)\(+=._-]+]*$/;
 const englishCharsRegex = /^[A-Za-z0-9!@#\$%\^\& *\)\(+=._-]+]*$/;
 const charsRegex = /^[A-Za-zء-ي!@#\$%\^\& *\)\(+=._-]+]*$/;
 export const onlyArabicChar = /^[ء-ي]*$/;
export const onlyEnglishChar = /^[A-Za-z]*$/;
 const urlRegex = /^((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)$/;
 const onlyNumbersRegex = /^[0-9]*$/
 const decimalNumber = /^[0-9]*\.?[0-9]*$/

  export class Validations{
    static arabicCharsValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isArabic(control.value);
          return isValid ? null : { arabic_char_only: errorMessage };
        };
      }
    
      static englishCharsValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isEnglish(control.value);
          return isValid ? null : { english_char_only: errorMessage };
        };
      }
      static onlyArabicValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isOnlyArabic(control.value);
          return isValid ? null : { arabic_only: errorMessage };
        };
      }
    
      static onlyEnglishValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isOnlyEnglish(control.value);
          return isValid ? null : { english_only: errorMessage };
        };
      }

      static decimalNumberValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isDecimal(control.value);
          return isValid ? null : { decimal_number: errorMessage };
        };
      }
      static onlyNumberValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isNumber(control.value);
          return isValid ? null : { only_number: errorMessage };
        };
      }

      static onlyCharacterValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isChar(control.value);
          return isValid ? null : { only_char: errorMessage };
        };
      }
  }



  export function isArabic(value: string): boolean {
    if (value) {
      return arabicCharsRegex.test(value);
    } else {
      return true;
    }
  }

  export function isEnglish(value: string): boolean {
    if (value) {
      return englishCharsRegex.test(value);
    } else {
      return true;
    }
  }

  export function isOnlyEnglish(value: string): boolean {
    if (value) {
      return onlyEnglishChar.test(value);
    } else {
      return true;
    }
  }

  export function isOnlyArabic(value: string): boolean {
    if (value) {
      return onlyArabicChar.test(value);
    } else {
      return true;
    }
  }

  export function isNumber(value: string): boolean {
    if (value) {
      return onlyNumbersRegex.test(value);
    } else {
      return true;
    }
  }
  
  export function isDecimal(value: string): boolean {
    if (value) {
      return decimalNumber.test(value);
    } else {
      return true;
    }
  }
  export function isChar(value: string): boolean {
    if (value) {
      return charsRegex.test(value);
    } else {
      return true;
    }
  }