import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-countries-details',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, NgIf,InputTextModule,InputTextComponent],
  templateUrl: './countries-details.component.html',
  styleUrl: './countries-details.component.scss'
})
export class CountriesDetailsComponent implements OnInit {
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  form = new FormGroup({
    enName: new FormControl('',{
      validators: [
        Validators.required,
        Validations.englishCharsValidator('faqs.validation_english_title'),
      ],
    }),
    arName: new FormControl('', {
      validators:[
        Validators.required,
        Validations.arabicCharsValidator('isArabic')
      ]
    }),
    enDescription: new FormControl('', {
      validators:[
        Validators.required,
        Validations.englishCharsValidator('faqs.validation_english_title'),
      ]
    }),
    arDescription: new FormControl('', {
      validators:[
        Validators.required,
        Validations.arabicCharsValidator('isArabic')
      ]
    }),
    currency: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    nationality: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    phoneLength: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    phoneCode: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    shortName: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    content: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    status: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    img: new FormControl('', {
      validators:[
      ]
    }),
  })

  get faqsID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    console.log(this.router.url)
    if(this.tyepMode()!=='add')
    this.getFaqsDetails()
  }

  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit'))
      return 'edit'
    else if (url.includes('view'))
      return 'view'
    else return 'add'

  }
  getFaqsDetails() {
    this.ApiService.get(`FAQs/GetById/${this.faqsID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
      questionId: this.faqsID,
      userType: 1
    }
    if (this.tyepMode() === 'add')
      this.addFQS(payload)
    else
      this.editFQS(payload)

  }

  addFQS(payload: any) {
    this.ApiService.post('FAQs/Create', payload, { showAlert: true, message: 'Add FAQS Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('faqs')
    })
  }
  editFQS(payload: any) {
    this.ApiService.put('FAQs/Update', payload, { showAlert: true, message: 'update FAQS Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('faqs')
    })
  }
}
