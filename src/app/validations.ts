import { AbstractControl, ValidatorFn } from "@angular/forms";

 const arabicCharsRegex = /^[ء-ي0-9!@#\$%\^\& *\)\(+=._-]+]*$/;
 const englishCharsRegex = /^[A-Za-z0-9!@#\$%\^\& *\)\(+=._-]+]*$/;
 const charsRegex = /^[A-Za-zء-ي!@#\$%\^\& *\)\(+=._-]+]*$/;
 const onlyArabicChar = /^[ء-ي]*$/;
 const onlyEnglishChar = /^[A-Za-z0-9]*$/;
 const urlRegex = /^((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)$/;
 const onlyNumbersRegex = /^[0-9]*$/

  export class Validations{
    static arabicCharsValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isArabic(control.value);
          return isValid ? null : { arabic_only: errorMessage };
        };
      }
    
      static englishCharsValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isEnglish(control.value);
          return isValid ? null : { english_only: errorMessage };
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