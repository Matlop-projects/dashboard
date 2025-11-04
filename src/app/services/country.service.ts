import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private api = inject(ApiService);

  getCountries() {
    return this.api.get('Country/GetAll');
  }
}