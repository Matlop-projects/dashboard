import { NgFor, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems } from '../../conts';
import { environment } from '../../../environments/environment';
import { SelectComponent } from '../select/select.component';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { API } from '../../core/api-endpoints';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor , Tooltip ,UpperCasePipe, TranslateModule , RouterModule , RouterLinkActive,SelectComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  baseImageUrl=environment.baseImageUrl
  selectedLang: any;
  languageService = inject(LanguageService);
  apiService=inject(ApiService)
  userDate = JSON.parse(localStorage.getItem('userData') || '{}');
  defaultImage = this.userDate?.gender == 1 ? 'assets/images/arabian-man.png' : 'assets/images/arabian-woman.png';
  routingList = menuItems
  countries: any[] = [];
  countryControl = new FormControl();
    
  loadCountries() {
    this.apiService.get(API.COUNTRIES.BASE).subscribe((res: any) => {
      if (res.data) {
        this.countries = res.data.map((country: any) => ({
          name: this.selectedLang === 'en' ? country.enName : country.arName,
          code: country.countryId,
        }));
      }
    });
  }
  
  initCountrySelection() {
    const savedCountryId = localStorage.getItem('countryId');
    if (savedCountryId) {
      this.countryControl.setValue(Number(savedCountryId));
    }
  }

  onCountryChange(countryId: number) {
    if (countryId) {
      localStorage.setItem('countryId', countryId.toString());
      // Reload to apply new country header
      window.location.reload();
    }
  }
  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
    this.initCountrySelection();
    this.loadCountries();
  }

}
