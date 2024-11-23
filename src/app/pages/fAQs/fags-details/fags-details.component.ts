import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';

@Component({
  selector: 'app-fags-details',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, NgIf,InputTextComponent],
  templateUrl: './fags-details.component.html',
  styleUrl: './fags-details.component.scss'
})
export class FagsDetailsComponent implements OnInit {
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  form = new FormGroup({
    enTitle: new FormControl('',{
      validators: [
        Validators.required,
        Validations.englishCharsValidator('faqs.validation_english_title'),
        Validators.minLength(3)
      ],
    }),
    arTitle: new FormControl('', {
      validators:[
        Validations.arabicCharsValidator()
      ]
    }),
    enDescription: new FormControl('', {
      validators:[
        Validations.englishCharsValidator('isEnglish')
      ]
    }),
    arDescription: new FormControl('', {
      validators:[
        Validations.arabicCharsValidator('isArabic')
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
