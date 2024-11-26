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
@Component({
  selector: 'app-countries-details',
  standalone: true,
  imports: [BreadcrumpComponent, ReactiveFormsModule, ButtonModule, NgIf,InputTextComponent,SelectComponent],
  templateUrl: './countries-details.component.html',
  styleUrl: './countries-details.component.scss'
})
export class CountriesDetailsComponent implements OnInit {
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  form = new FormGroup({
    enName: new FormControl('',{
      validators: [
        Validators.required,
        Validations.englishCharsValidator('faqs.validation_english_title'),
      ],
    }),
    arName: new FormControl('', {
      validators:[
        Validators.required,
        Validations.arabicCharsValidator('isArabic')
      ]
    }),
    enDescription: new FormControl('', {
      validators:[
        Validators.required,
        Validations.englishCharsValidator('faqs.validation_english_title'),
      ]
    }),
    arDescription: new FormControl('', {
      validators:[
        Validators.required,
        Validations.arabicCharsValidator('isArabic')
      ]
    }),
    currency: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    nationality: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    phoneLength: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    phoneCode: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    shortName: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    content: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    status: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    img: new FormControl('', {
      validators:[
      ]
    }),
    aas:new FormControl('')
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Add Country',
      },
    ]
  }

  get countryID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    console.log(this.router.url)
    if(this.tyepMode()!=='add')
    this.getCountryDetails()
  }

  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit'))
      return 'edit'
    else if (url.includes('view'))
      return 'view'
    else return 'add'

  }
  getCountryDetails() {
    this.ApiService.get(`Country/GetCountry/${this.countryID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    console.log('ff',this.form.value)
    const payload = {
      ...this.form.value,
      countryId: this.countryID,
      userType: 1
    }
    if (this.tyepMode() === 'add')
      this.addCountry(payload)
    else
      this.editCountry(payload)

  }

  addCountry(payload: any) {
    this.ApiService.post('Country/CreateCountry', payload, { showAlert: true, message: 'Add country Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('country')
    })
  }
  editCountry(payload: any) {
    this.ApiService.put('Country/UpdateCountry', payload, { showAlert: true, message: 'update country Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('country')
    })
  }
}
