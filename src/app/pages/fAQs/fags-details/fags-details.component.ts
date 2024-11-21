import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fags-details',
  standalone: true,
  imports: [ReactiveFormsModule,InputTextModule, ButtonModule],
  templateUrl: './fags-details.component.html',
  styleUrl: './fags-details.component.scss'
})
export class FagsDetailsComponent {
  private ApiService =inject(ApiService)
  private router =inject(Router)

  form=new FormGroup({
    enTitle:new FormControl('',Validators.required),
    arTitle:new FormControl('',Validators.required),
    enDescription:new FormControl('',Validators.required),
    arDescription:new FormControl('',Validators.required),
  })

  onSubmit(){
    const payload ={
      ...this.form.value,
      userType: 2
    }
    console.log("FagsDetailsComponent  onSubmit  payload:", payload)
    this.ApiService.post(environment.baseUrl,'FAQs/Create',payload,{showAlert:true,message:'Add FAQS Successfuly'}).subscribe(res=>{
      if(res)
        this.router.navigateByUrl('faqs')
    })
  }
}
