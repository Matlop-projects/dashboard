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
    let requiredLength=''
    const matches = this.getErrorKey(value) ||''  
    let customMessage: string = '';
    if(matches=='minlength')
      requiredLength=value.minlength?.requiredLength
    if(matches=='maxlength')
      requiredLength=value.maxlength?.requiredLength
    if(matches=='english_only')
      customMessage=value.english_only
    if(matches=='value.arabic_only')
      customMessage=value.arabic_only
    this.translate.get(`validation_message.${matches}_validation`).subscribe((translationWord) => {
      result = customMessage? this.translate.instant(customMessage) : 
       (['minlength','maxlength'].includes(matches)?`${translationWord} (${requiredLength})`:translationWord)
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
