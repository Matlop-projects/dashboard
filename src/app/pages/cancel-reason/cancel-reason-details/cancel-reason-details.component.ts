import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations, isEnglishEditorValidator } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { SelectComponent } from '../../../components/select/select.component';
import { userType } from '../../../conts';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cancel-reason-details',
  standalone: true,
  imports: [ReactiveFormsModule,TranslatePipe, SelectComponent, ButtonModule, NgIf, DialogComponent, TitleCasePipe, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './cancel-reason-details.component.html',
  styleUrl: './cancel-reason-details.component.scss'
})
export class CancelReasonDetailsComponent {
  pageName = signal<string>('');
  userTypeList = userType
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  private translateService = inject(TranslateService)

  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.englishCharsValidator(),
      ],
    }),
    arName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.arabicCharsValidator()
      ]
    }),
    enDescription: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    arDescription: new FormControl('', {
      validators: [
        Validators.required,
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
        label: this.pageName(),
      },
    ]
  }

  get getID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.pageName.set('cancel_reason.pageName')
    if (this.tyepMode() !== 'Add')
      this.getCancelReasonsDetails()
  }

  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'

    this.bredCrumb.crumbs[1].label =this.translateService.instant(this.pageName()+ '_'+result+'_crumb');
    return result
  }

  getCancelReasonsDetails() {
    this.ApiService.get(`CancelReason/GetCancelReason/${this.getID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
      reasonId: this.getID,
    }
    if (this.tyepMode() == 'Add')
      this.addCancelReason(payload)
    else
      this.editCancelReason(payload)
  }

  navigateToPageTable() {
    this.router.navigateByUrl('/cancel-reason')
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.navigateToPageTable()

  }

  onConfirmMessage() {
    this.navigateToPageTable()

  }

  addCancelReason(payload: any) {
    this.ApiService.post('CancelReason/CreateCancelReason', payload, { showAlert: true, message: `Add ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }

  editCancelReason(payload: any) {
    this.ApiService.put('CancelReason/UpdateCancelReason', payload, { showAlert: true, message: `update ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }


}

