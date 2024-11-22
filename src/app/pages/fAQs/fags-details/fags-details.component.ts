import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-fags-details',
  standalone: true,
  imports: [ReactiveFormsModule,InputTextModule, ButtonModule,NgIf],
  templateUrl: './fags-details.component.html',
  styleUrl: './fags-details.component.scss'
})
export class FagsDetailsComponent implements OnInit{
  private ApiService =inject(ApiService)
  private router =inject(Router)
  private route =inject(ActivatedRoute)
  form=new FormGroup({
    enTitle:new FormControl('',Validators.required),
    arTitle:new FormControl('',Validators.required),
    enDescription:new FormControl('',Validators.required),
    arDescription:new FormControl('',Validators.required),
  })

  get faqsID(){
return this.route.snapshot.params['id']
  }

  ngOnInit() {
     console.log(this.router.url) 
     this.getFaqsDetails()
  }

  tyepMode(){
    const url =this.router.url;
    if(url.includes('edit'))
   return 'edit'
else if(url.includes('view'))
  return 'view'
else return 'add'

  }
  getFaqsDetails(){
    this.ApiService.get(`FAQs/GetById/${this.faqsID}`).subscribe((res:any)=>{
       if(res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit(){
    const payload ={
      ...this.form.value,
      questionId:0,
      userType: 1
    }
     if(this.tyepMode()==='add')
      this.addFQS(payload)
      else
      this.editFQS(payload)

  }

  addFQS(payload:any){
    this.ApiService.post('FAQs/Create',payload,{showAlert:true,message:'Add FAQS Successfuly'}).subscribe(res=>{
      if(res)
        this.router.navigateByUrl('faqs')
    })
  }
  editFQS(payload:any){
    this.ApiService.put('FAQs/Update',payload,{showAlert:true,message:'update FAQS Successfuly'}).subscribe(res=>{
      if(res)
        this.router.navigateByUrl('faqs')
    })
  }
}
