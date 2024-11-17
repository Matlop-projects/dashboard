import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {


  messageService = inject(MessageService);
  languageService = inject(LanguageService);

  constructor() { }

  successToaster(message: string) {
    console.log(message);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: this.languageService.translate(message),
      life: 90000,
    });
  }

  errorToaster(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.languageService.translate(message),
      life: 4000,
    });
  }
}
