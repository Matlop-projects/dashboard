import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API } from '../core/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private api = inject(ApiService);

  getCountries() {
    return this.api.get(API.COUNTRIES.BASE);
  }
}