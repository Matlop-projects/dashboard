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
import { LanguageService } from '../../../services/language.service';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-technical-details',
  standalone: true,
  imports: [ReactiveFormsModule, 
     EditModeImageComponent,
    ButtonModule, NgIf, SelectComponent, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent, CheckBoxComponent, DatePickerComponent],
  templateUrl: './technical-details.component.html',
  styleUrl: './technical-details.component.scss'
})
export class TechnicalDetailsComponent {

  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  languageService = inject(LanguageService);
  selectedLang: any;

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
    technicalTypeEnum: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    technicalSpecialistId: new FormControl('', {
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

  TechnicalType = [
    { code: 1, name: 'Technical' },
    { code: 2, name: 'Driver' }
  ]

  technicalSpecialist: any;


  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Technical',
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
  specialistOriginal: any;

  get userId() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.getTechnicalSpecialist();
    this.selectedLang = this.languageService.translationService.currentLang;
    if (this.tyepMode() !== 'add') {
      this.getTechnicalsDetails();

    }

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.technicalSpecialist = this.specialistOriginal.map((item: any) => ({
        code: item.technicalSpecialistId,
        name: this.selectedLang === 'ar' ? item.arName : item.enName
      })
    );
    })
  }

  onPasswordChanged(value:any){
    this.form.get('confirmPassword')?.reset()
}
onConfirmPasswordChanged(value:string){
    const ctrlConfirm =this.form.controls.confirmPassword
    ctrlConfirm.setValidators(Validations.confirmValue(this.form.value.password))
    ctrlConfirm.updateValueAndValidity()
}
  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit')) {
      this.bredCrumb.crumbs[1].label = 'Edit Technical';
      return 'edit'
    } else if (url.includes('view')) {
      this.bredCrumb.crumbs[1].label = 'View Technical';
      return 'view'
    } else {
      this.bredCrumb.crumbs[1].label = 'Add Technical';
      return 'add'
    }
  }


  getTechnicalsDetails() {
    this.ApiService.get(`Technical/GetById/${this.userId}`).subscribe((res: any) => {
      if (res && res.data) {
        const technicalData = res.data;

        // Convert `dateOfBirth` to a Date object if it exists
        if (technicalData.dateOfBirth) {
          technicalData.dateOfBirth = new Date(technicalData.dateOfBirth);
        }

        const password = res.data?.password;
        if (password) {
          this.form.get('confirmPassword')?.setValue(password);
        }

        this.form.patchValue(technicalData);
        this.editMode = true;
        this.editImageProps.props.imgSrc = environment.baseImageUrl + res.data.imgSrc;
        console.log("TechnicalDetailsComponent  this.ApiService.get  this.editImageProps.props.imgSrc:", this.editImageProps.props.imgSrc)
        this.removeValidators()
      }

    })

  }

  removeValidators(){
    const ctrlform =this.form.controls
    ctrlform.confirmPassword.removeValidators(Validators.required)
    ctrlform.confirmPassword.updateValueAndValidity()
    ctrlform.password.removeValidators(Validators.required)
    ctrlform.password.updateValueAndValidity()
    ctrlform.pinCode.removeValidators(Validators.required)
    ctrlform.pinCode.updateValueAndValidity()
  }
  getTechnicalSpecialist() {
    this.ApiService.get(`TechnicalSpecialist/GetAll`).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res);
       this.specialistOriginal =  res.data
        this.technicalSpecialist = res.data;

        this.technicalSpecialist =  this.specialistOriginal.map((item: any) => ({
          code: item.technicalSpecialistId,
          name: this.selectedLang === 'ar' ? item.arName : item.enName
        }));
      }

    })
  }

  onSubmit() {
    if (this.tyepMode() === 'add')
      this.addFQS( this.form.value)
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
      this.router.navigateByUrl('/technicals')

  }

  onConfirmMessage() {
    this.router.navigateByUrl('/technicals')

  }

  addFQS(payload: any) {
    this.ApiService.post('Technical/Create', payload, { showAlert: true, message: 'Add Client Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('technicals')
    })
  }

  editFQS(payload: any) {
    this.ApiService.put('Technical/Update', payload, { showAlert: true, message: 'update Client Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('technicals')
    })
  }


}


