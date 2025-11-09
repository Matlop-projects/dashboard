import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { LanguageService } from '../../services/language.service';
import { environment } from '../../../environments/environment';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { NgIf, TitleCasePipe } from '@angular/common';
import { CountryService } from '../../services/country.service';
import { SelectComponent } from '../../components/select/select.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-images',
  standalone: true,
  imports: [TranslateModule, TranslatePipe, BreadcrumpComponent, TitleCasePipe , NgIf, SelectComponent],
  templateUrl: './order-images.component.html',
  styleUrl: './order-images.component.scss'
})
export class OrderImagesComponent implements OnInit {
  uploadedImage: string | ArrayBuffer | null = null;
  typeParam: string | null = null;
  api = inject(ApiService);
  toaster = inject(ToasterService)
  languageService = inject(LanguageService);
  countryService = inject(CountryService);
  bredCrumb: IBreadcrumb = {
    crumbs: []
  }
  countries: any[] = [];
  countryIdControl: FormControl = new FormControl(1); // Default to Saudi Arabia
  selectedCountryName: string = ''; // Initialize as empty, will be set after countries are loaded

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    debugger;
    this.route.paramMap.subscribe(params => {
      this.typeParam = params.get('type') || 'e';
      this.getCountries();
      this.getImage(this.countryIdControl.value);
      this.getBreadCrumb();
    });

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.getBreadCrumb();

    })
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.typeParam == 'e' ? this.languageService.translate('side_bar.emergency_orders') : this.languageService.translate('side_bar.special_orders_2'),
        },
      ]
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.uploadedImage = reader.result; // for image preview

      const fullBase64 = reader.result as string; // includes data:image/png;base64,...
      this.apiCallForUpload(fullBase64, this.countryIdControl.value);
    };

    reader.readAsDataURL(file); // keeps the MIME type prefix
  }


  apiCallForUpload(base64WithPrefix: string, countryId: number): void {
    debugger;
    const link = this.typeParam === 'e'
      ? 'OrderDefaultImage/CreateEmercencyOrderDefaultImage'
      : 'OrderDefaultImage/CreateSpecialOrderDefaultImage';

    const imageObject = this.typeParam === 'e'
      ? { emergencyImage: base64WithPrefix, countryId: countryId }
      : { specialOrderImage: base64WithPrefix, countryId: countryId };

    this.api.post(link, imageObject).subscribe((res: any) => {
      this.toaster.successToaster(res.message)
      this.getImage(this.countryIdControl.value);
    });
  }


  getImage(countryId: number): void {
    debugger;
    const link = this.typeParam === 'e'
      ? `OrderDefaultImage/GetEmercencyOrderDefaultImage?CountryId=${countryId}`
      : `OrderDefaultImage/GetSpecialOrderDefaultImage?CountryId=${countryId}`;

    this.api.get(link).subscribe((res: any) => {
      if (res.data) {
        this.uploadedImage =
          this.typeParam === 'e'
            ? environment.baseImageUrl + res.data.emergencyImage
            : environment.baseImageUrl + res.data.specialOrderImage;
      } else {
        this.uploadedImage = null; // Set to null if no image data is returned
      }
      console.log('Uploaded Image after API call:', this.uploadedImage);
    });
  }

  getCountries() {
    this.countryService.getCountries().subscribe((res: any) => {
        if (res) {
     this.countries = []; // Clear the array before populating
     res.data.map((country:any)=>{
         this.countries.push({
          name:this.languageService.translationService.currentLang=='en'?country.enName :country.arName,
          code:country.countryId
         })
     })
     // Set selectedCountryName after countries are loaded
     const defaultCountry = this.countries.find(country => country.code === this.countryIdControl.value);
     if (defaultCountry) {
       this.selectedCountryName = defaultCountry.name;
     }
    }
    })
  }

  onCountryChange(countryId: number) {
    console.log('Country ID received in onCountryChange:', countryId);
    this.countryIdControl.setValue(countryId);
    const selectedCountry = this.countries.find(country => country.code === countryId);
    if (selectedCountry) {
      this.selectedCountryName = selectedCountry.name;
    }
    this.getImage(countryId);
  }
}
