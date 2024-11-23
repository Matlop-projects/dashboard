import { Pipe, PipeTransform,inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'validationHandlerPipe',
  standalone: true
})
export class ValidationHandlerPipePipe implements PipeTransform {
  translate=inject(TranslateService)

  transform(value: any) {
    let result = '';
    const matches = this.getErrorKey(value)   
    console.log("ValidationHandlerPipePipe  transform  value:", value)
    let customMessage: string = '';
    if(value.minlength?.requiredLength)
      customMessage=`this field should be more than or equal (${value.minlength?.requiredLength})`
      console.log("ValidationHandlerPipePipe  transform  value:", value)
    if(value.english_only)
      customMessage=value.english_only
    console.log("ValidationHandlerPipePipe  transform  value:", value)
    if(value.arabic_only)
      customMessage='accept ar'
    this.translate.get(`validation_message.${matches}_validation`).subscribe((translationWord) => {
      result = customMessage? this.translate.instant(customMessage) :  translationWord
      // result =  translationWord + (customMessage ? '(' + customMessage + ')' : '');
      console.log("ValidationHandlerPipePipe  this.translate.get  result:", result)
    });

    return result;
  }

  getErrorKey(errors: any): string | null {
    if (!errors || typeof errors !== 'object') {
      return null;
    }
  
    const keys = Object.keys(errors);
    return keys.length > 0 ? keys[0] : null;
  }

}
