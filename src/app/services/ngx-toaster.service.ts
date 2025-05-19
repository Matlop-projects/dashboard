import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NgxToasterService {

  constructor(private ngxToaster :ToastrService,private translate:TranslateService) { }

  success(message:string){
    const title =this.translate.instant('Success')
    const messageBody = `<div>${this.translate.instant(message)}</div>`;

    this.ngxToaster.success(messageBody,title,{
      enableHtml: true, 
      closeButton: true, 
    })


  }
  error(message:string){
    const title =this.translate.instant('Error')
    const messageBody = `<div>${this.translate.instant(message)}</div>`;

    this.ngxToaster.error(messageBody,title,{
      enableHtml: true, 
      closeButton: true, 
    })

  }
}
