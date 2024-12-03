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
import { coponeOfferTypeList, coponeTypeList, PackageTypeList } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { LanguageService } from '../../../services/language.service';

const global_PageName = 'package';
const global_API_deialis = global_PageName + '/GetPackage';
const global_API_create = global_PageName + '/CreatePackage';
const global_API_update = global_PageName + '/UpdatePackage';
const global_routeUrl = global_PageName

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe, ButtonModule,SelectComponent, CheckBoxComponent, NgIf, DialogComponent, DatePickerComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.scss'
})
export class PackageDetailsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  typeOfPackageList:any[]=PackageTypeList
  contractTypeList:any[]=[]
 
  form = new FormGroup({
    nameEn: new FormControl('', {
      validators: [
        Validators.required,
        Validations.englishCharsValidator()
      ],
    }),
    nameAr: new FormControl <any>('', {
      validators: [
        Validators.required,
        Validations.arabicCharsValidator()
      ]
    }),
    providerNumber: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    visitNumber: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    typeOfPackage: new FormControl<any>('', {
      validators: [
        Validators.required
      ]
    }),
    visitHours: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    price: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    descriptionEn: new FormControl('', {
      validators: [
         Validators.required,
      ]
    }),
    descriptionAr: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    instractionEn: new FormControl('', {
      validators: [
         Validators.required,
      ]
    }),
    instractionAr: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    isActive: new FormControl(false, {
    }),
    contractTypeId: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    image: new FormControl('', {
    }),
    packageId: new FormControl(this.getID | 0),
 
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

  selectedLang: any;
  languageService = inject(LanguageService);
  get getID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.getAllContract()
    this.pageName.set(global_PageName)
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()

    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      console.log("CityDetailsComponent  this.languageService.translationService.onLangChange.subscribe   this.selectedLang:",  this.selectedLang)
      this.API_getItemDetails();
      this.getAllContract()

    })
  }

  getAllContract(){
    this.ApiService.post('ContractType/GetAllContractTypeList',{}).subscribe((res:any)=>{
      if(res.data){
        this.contractTypeList=[]
        res.data.map((item:any)=>{
          this.contractTypeList.push({
            name:this.selectedLang=='ar'?item.arName:item.enName,
            code:item.contractTypeId
          })
        })
       
      }
       
       
    })
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
    if(this.getID)
    this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
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

