import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';

const global_PageName = 'copone';
const global_API_deialis = global_PageName + '/GetById';
const global_API_create = global_PageName + '/Create';
const global_API_update = global_PageName + '/Update';
const global_routeUrl = global_PageName

@Component({
  selector: 'app-copone-details',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe, ButtonModule, CheckBoxComponent, NgIf, DialogComponent, DatePickerComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './copone-details.component.html',
  styleUrl: './copone-details.component.scss'
})
export class CoponeDetailsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  form = new FormGroup({
    code: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    usedNumber: new FormControl <any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    offerType: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    amount: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    coponeType: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    startDate: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    endDate: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    enDescription: new FormControl('', {
      validators: [

      ]
    }),
    arDescription: new FormControl('', {
      validators: [

      ]
    }),
    status: new FormControl(false, {
    }),
    coponeId: new FormControl(this.getID | 0),
    userType: new FormControl(1),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: this.pageName(),
      },
    ]
  }

  get getID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.pageName.set(global_PageName)
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
  }

  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'

    this.bredCrumb.crumbs[1].label = result + ' ' + this.pageName();
    return result
  }

  API_getItemDetails() {
    this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
      amount: +this.form.value.amount,
      coponeType: +this.form.value.coponeType,
      offerType: +this.form.value.offerType,
      usedNumber: +this.form.value.usedNumber
    }
    if (this.tyepMode() == 'Add')
      this.API_forAddItem(payload)
    else
      this.API_forEditItem(payload)
  }

  navigateToPageTable() {
    this.router.navigateByUrl(global_routeUrl)
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue && this.tyepMode() == 'Edit')
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.navigateToPageTable()

  }

  onConfirmMessage() {
    this.navigateToPageTable()

  }


  API_forAddItem(payload: any) {
    this.ApiService.post(global_API_create, payload, { showAlert: true, message: `Add ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }

  API_forEditItem(payload: any) {
    this.ApiService.put(global_API_update, payload, { showAlert: true, message: `update ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }


}

