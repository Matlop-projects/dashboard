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
  selector: 'app-city-details',
  standalone: true,
  imports: [BreadcrumpComponent, ReactiveFormsModule, ButtonModule, NgIf,InputTextComponent,SelectComponent],
  templateUrl: './city-details.component.html',
  styleUrl: './city-details.component.scss'
})
export class CityDetailsComponent {
  countries=[]
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  form = new FormGroup({
    enName: new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    arName: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    postalCode: new FormControl('', {
      validators:[
        Validators.required,
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
      ]
    }),
    longitude: new FormControl('', {
      validators:[
        Validators.required,
      ]
    }),
    countryId: new FormControl(0, {
      validators:[
        Validators.required,
      ]
    }),
    status: new FormControl('', {
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
    console.log(this.router.url)
    if(this.tyepMode()!=='add')
    this.getCityDetails()
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
      cityId: this.cityID,
      userType: 1
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
}
