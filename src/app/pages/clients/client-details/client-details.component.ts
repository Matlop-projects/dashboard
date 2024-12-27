import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { CheckBoxComponent } from "../../../components/check-box/check-box.component";
import { DatePickerComponent } from "../../../components/date-picker/date-picker.component";
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [ReactiveFormsModule,EditModeImageComponent, ButtonModule, NgIf, SelectComponent, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent, CheckBoxComponent, DatePickerComponent],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss'
})
export class ClientDetailsComponent {

  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  userTypeList = userType
  private confirm = inject(ConfirmMsgService)
  form = new FormGroup({
    firstName: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    lastName: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    username: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    mobileNumber: new FormControl('', {
      validators: [
        Validators.required,

      ]
    }),
    pinCode: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,

      ]
    }),
    confirmPassword: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    // notes: new FormControl('', {
    //   validators: [
    //     Validators.required,

    //   ]
    // }),
    imgSrc: new FormControl('', {
      validators: [
        Validators.required,

      ]
    }),
    gender: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    isActive: new FormControl(false, {
      validators: [
        Validators.required,

      ]
    }),
    dateOfBirth: new FormControl(false, {
      validators: [
        Validators.required,

      ]
    }),
    userId:new FormControl(this.userId|0)
  })

  gender = [
    { code: 1, name: 'Male' },
    { code: 2, name: 'Fale' }
  ]

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Client',
      },
    ]
  }

  maxDate = new Date();

  editImageProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editMode = false;
    }
  };

  editMode: boolean = false;

  get userId() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    if (this.tyepMode() !== 'add')
      this.getClientsDetails()
  }

  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit')) {
      this.bredCrumb.crumbs[1].label = 'Edit Client';
      return 'edit'
    } else if (url.includes('view')) {
      this.bredCrumb.crumbs[1].label = 'View Client';
      return 'view'
    } else {
      this.bredCrumb.crumbs[1].label = 'Add Client';
      return 'add'
    }
  }



  onPasswordChanged(value:any){
    this.form.get('confirmPassword')?.reset()
}
onConfirmPasswordChanged(value:string){
    const ctrlConfirm =this.form.controls.confirmPassword
    ctrlConfirm.setValidators(Validations.confirmValue(this.form.value.password))
    ctrlConfirm.updateValueAndValidity()
}

  getClientsDetails() {
    this.ApiService.get(`Client/GetById/${this.userId}`).subscribe((res: any) => {
      if (res && res.data) {
        const clientData = res.data;

        // Convert `dateOfBirth` to a Date object if it exists
        if (clientData.dateOfBirth) {
          clientData.dateOfBirth = new Date(clientData.dateOfBirth);
        }

        const password = res.data?.password;
        if (password) {
          this.form.get('confirmPassword')?.setValue(password);
        }

        this.form.patchValue(clientData);
        this.editMode = true;
        this.editImageProps.props.imgSrc = environment.baseImageUrl + res.data.imgSrc;
        console.log("ClientDetailsComponent  this.ApiService.get  this.editImageProps.props.imgSrc :", this.editImageProps.props.imgSrc )
      this.removeValidators()
      }
    });
  }
  removeValidators(){
    const ctrlform =this.form.controls
    ctrlform.confirmPassword.removeValidators(Validators.required)
    ctrlform.confirmPassword.updateValueAndValidity()
    ctrlform.password.removeValidators(Validators.required)
    ctrlform.password.updateValueAndValidity()
    ctrlform.pinCode.removeValidators(Validators.required)
    ctrlform.pinCode.updateValueAndValidity()
      delete this.form.value.confirmPassword
      delete this.form.value.password
      delete this.form.value.pinCode
  }
  onSubmit() {

    if (this.tyepMode() === 'add')
      this.addFQS(this.form.value)
    else{
      delete this.form.value.confirmPassword
      delete this.form.value.password
      delete this.form.value.pinCode
      this.editFQS(this.form.value)
    }
      
  }

  get isRequiredError(): boolean {
    const control = this.form.get('imgSrc');
    return control?.touched && control?.hasError('required') || false;
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.router.navigateByUrl('/clients')

  }

  onConfirmMessage() {
    this.router.navigateByUrl('/clients')

  }

  addFQS(payload: any) {
    this.ApiService.post('Client/Create', payload, { showAlert: true, message: 'Add Client Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('clients')
    })
  }

  editFQS(payload: any) {
    this.ApiService.put('Client/Update', payload, { showAlert: true, message: 'update Client Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('clients')
    })
  }


}

