import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Validations, isChar } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { UploadFileComponent } from '../../../components/upload-file/upload-file.component';
import { EditorComponent } from '../../../components/editor/editor.component';

@Component({
  selector: 'app-services-details',
  standalone: true,
  imports: [
    BreadcrumpComponent,
    ReactiveFormsModule,
    ButtonModule,
    NgIf,
    InputTextComponent,
    DialogComponent,
    CheckBoxComponent,
    UploadFileComponent,
    EditorComponent
  ],  templateUrl: './services-details.component.html',
  styleUrl: './services-details.component.scss'
})
export class ServicesDetailsComponent {

  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  form = new FormGroup({
    nameEn: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyEnglishValidators(),
      ],
    }),
    nameAr: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyArabicValidators()
      ]
    }),
    descriptionEn: new FormControl('', {
      validators: [
        Validators.required,
        // Validations.englishCharsValidator('faqs.validation_english_title'),
      ]
    }),
    descriptionAr: new FormControl('', {
      validators: [
        Validators.required,
        // Validations.arabicCharsValidator('isArabic')
      ]
    }),
    numOfTechnicals: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    priorityView: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    isActive: new FormControl(false),
    image: new FormControl(null, {
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
        label: 'Service',
      },
    ]
  }

  get serviceId() {
    return this.route.snapshot.params['id']
  }

  get isRequiredError(): boolean {
    const control = this.form.get('image');
    return control?.touched && control?.hasError('required') || false;
  }

  ngOnInit() {
    console.log(this.router.url)
    if (this.tyepMode() !== 'add')
      this.getCountryDetails()
  }

  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit')) {
      this.bredCrumb.crumbs[1].label = 'Edit Service';
      return 'edit'
    } else if (url.includes('view')) {
      this.bredCrumb.crumbs[1].label = 'View Service';
      return 'view'
    } else {
      this.bredCrumb.crumbs[1].label = 'Add Service';
      return 'add'
    }
  }

  getCountryDetails() {
    this.ApiService.get(`Service/GetService/${this.serviceId}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
//     console.log('ff', this.form.value)
//     console.log(this.form.valid); // Logs form validity
// console.log(this.form.errors); // Logs form-level errors, if any
// console.log(this.form.controls);
    const payload = {
      ...this.form.value,
      serviceId: this.serviceId,
    }
    if (this.tyepMode() === 'add')
      this.addService(payload)
    else
      this.editService(payload)

  }

  addService(payload: any) {
    this.ApiService.post('Service/CreateService', payload, { showAlert: true, message: 'Add Service Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('services')
    })
  }

  editService(payload: any) {
    this.ApiService.put('Service/UpdateService', payload, { showAlert: true, message: 'update Service Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('services')
    })
  }


  cancel() {
    const confirmed = this.confirm.formHasValue(this.form)
    if (confirmed)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.router.navigateByUrl('/services')
  }
  onConfirmMessage() {
    this.router.navigateByUrl('/services')
  }
}
