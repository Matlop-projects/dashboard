import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectComponent } from '../../../components/select/select.component';
import { LanguageService } from '../../../services/language.service';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { gender } from '../../../conts';

const global_PageName = 'admin.pageName';
const global_API_deialis =  'admin/GetById';
const global_API_create =  'admin/Create';
const global_API_update =  'admin/Update';
const global_routeUrl = 'settings/admin'

@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    SelectComponent, 
    ButtonModule, 
    NgIf, 
    DialogComponent, 
    TitleCasePipe, 
    InputTextComponent, 
    RouterModule, 
    BreadcrumpComponent, 
    CheckBoxComponent
  ],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss'
})
export class AdminDetailsComponent {
pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  roleList:any[]=[]
  genderList=gender

  minEndDate:Date =new Date()
   selectedLang: any;
    languageService = inject(LanguageService);

  form = new FormGroup({
    firstName: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    lastName: new FormControl <any>('', {
      validators: [
        Validators.required,
      ]
    }),
    email: new FormControl <any>('', {
      validators: [
        Validators.required,
        Validations.emailValidator()
      ]
    }),
    userName: new FormControl<any>('', {
      validators: [
        Validators.required
      ]
    }),
    mobileNumber: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    roleId: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    password: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    confirmPassword: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    gender: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    isActive: new FormControl<boolean>(true),
    userId: new FormControl(this.getID | 0),
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
    this.getAllRoles()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getAllRoles()

    })
   
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()

  }
 
  getAllRoles(){
    this.ApiService.get('role/GetAll').subscribe((res:any)=>{
       if(res.data){
          res.data.map((item:any) => {
             this.roleList.push({
              name:this.selectedLang=='ar'?item.arName :item.enName,
              code:item.roleId
             })
          })
       }
    })
  }
   
  onStartDateChange(date:Date){
    this.minEndDate=date
  }
  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'

    this.bredCrumb.crumbs[1].label = result + ' ' + this.languageService.translate(this.pageName());
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
      ...this.form.value
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

