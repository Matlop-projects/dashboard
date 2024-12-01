import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { userType } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';

@Component({
  selector: 'app-fags-details',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, NgIf,SelectComponent, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './fags-details.component.html',
  styleUrl: './fags-details.component.scss'
})

export class FagsDetailsComponent implements OnInit {

  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  userTypeList=userType
  private confirm = inject(ConfirmMsgService)
  form = new FormGroup({
    enTitle: new FormControl('', {
      validators: [
        Validators.required,
        Validations.englishCharsValidator('faqs.validation_english_title'),
      ],
    }),
    arTitle: new FormControl('', {
      validators: [
        Validators.required,
        Validations.arabicCharsValidator('isArabic')
      ]
    }),
    enDescription: new FormControl('', {
      validators: [
        Validators.required,
        Validations.editorEnglishCharsValidator(),
      ]
    }),
    arDescription: new FormControl('', {
      validators: [
        Validators.required,
        Validations.editorArabicCharsValidator()
      ]
    }),
    userType: new FormControl('', {
      validators: [
        Validators.required,

      ]
    })
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'FAQs',
      },
    ]
  }

  get faqsID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    if (this.tyepMode() !== 'add')
      this.getFaqsDetails()
  }

  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit')) {
      this.bredCrumb.crumbs[1].label = 'Edit FAQs';
      return 'edit'
    } else if (url.includes('view')) {
      this.bredCrumb.crumbs[1].label = 'View FAQs';
      return 'view'
    } else {
      this.bredCrumb.crumbs[1].label = 'Add FAQs';
      return 'add'
    }
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
    }
    if (this.tyepMode() === 'add')
      this.addFQS(payload)
    else
      this.editFQS(payload)
  }


  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.router.navigateByUrl('/settings/faqs')

  }

  onConfirmMessage() {
    this.router.navigateByUrl('/settings/faqs')

  }

  addFQS(payload: any) {
    this.ApiService.post('FAQs/Create', payload, { showAlert: true, message: 'Add FAQS Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('settings/faqs')
    })
  }

  editFQS(payload: any) {
    this.ApiService.put('FAQs/Update', payload, { showAlert: true, message: 'update FAQS Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('settings/faqs')
    })
  }


}
