import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { SelectComponent } from '../../../components/select/select.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { LanguageService } from '../../../services/language.service';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-city-details',
  standalone: true,
  imports: [BreadcrumpComponent, ReactiveFormsModule,ToastModule,ConfirmDialog,DialogComponent, ButtonModule,CheckBoxComponent ,NgIf,InputTextComponent,SelectComponent],
  templateUrl: './city-details.component.html',
  styleUrl: './city-details.component.scss'
})
export class CityDetailsComponent {
  countries:any=[]
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage:boolean=false
  private confirm = inject(ConfirmMsgService)
  selectedLang: any;
  languageService = inject(LanguageService);
  form = new FormGroup({
    enName: new FormControl('',{
      validators: [
        Validators.required,
        Validations.englishCharsValidator(),
      ],
    }),
    arName: new FormControl('', {
      validators:[
        Validators.required,
        Validations.arabicCharsValidator()
      ]
    }),
    postalCode: new FormControl('', {
      validators:[
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    shortCut: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    latitude: new FormControl('', {
      validators:[
        Validators.required,
        Validations.decimalNumberValidators()
      ]
    }),
    longitude: new FormControl('', {
      validators:[
        Validators.required,
        Validations.decimalNumberValidators()
      ]
    }),
    countryId: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    status: new FormControl <boolean>(false, {
      validators:[
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
        label: 'Add City',
      },
    ]
  }

  get cityID() {
    return this.route.snapshot.params['id']
  }
  

  ngOnInit() {
    this.getAllCountries()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      console.log("CityDetailsComponent  this.languageService.translationService.onLangChange.subscribe   this.selectedLang:",  this.selectedLang)
      this.getAllCountries()

    })
    console.log(this.router.url)
    if(this.tyepMode()!=='add')
    this.getCityDetails()
  }
getAllCountries(){
  let payload={
    pageNumber: 0,
    pageSize: 7,
    sortingExpression: "",
    sortingDirection: 0,
    enName: "",
    arName: "",
  }
  this.ApiService.post('Country/GetAllCountry',payload).subscribe((res: any) => {
    if (res) {
     res.data.dataList.map((country:any)=>{
         this.countries.push({
          name:this.selectedLang=='en'?country.enName :country.arName,
          code:country.countryId
         })
     })
    }
  })
}
  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit'))
      return 'edit'
    else if (url.includes('view'))
      return 'view'
    else return 'add'

  }
  getCityDetails() {
    this.ApiService.get(`City/GetById/${this.cityID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    console.log('ff',this.form.value)
    const payload = {
      ...this.form.value,
      cityId: this.cityID|0,
    }
    if (this.tyepMode() === 'add')
      this.addCity(payload)
    else
      this.editCity(payload)

  }

  addCity(payload: any) {
    this.ApiService.post('City/Create', payload, { showAlert: true, message: 'Add City Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('city')
    })
  }
  editCity(payload: any) {
    this.ApiService.put('City/Update', payload, { showAlert: true, message: 'Update City Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('city')
    })
  }

  cancel(){
   const confirmed=  this.confirm.formHasValue(this.form)
      if(confirmed)
        this.showConfirmMessage=!this.showConfirmMessage
      else
      this.router.navigateByUrl('city')
  }
  onConfirmMessage(){
    this.router.navigateByUrl('city')
  }
}
