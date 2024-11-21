import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  login(object: any): Observable<any> {
    return this.http.post(
      baseUrl + `Authentication/login`,
      object
    );
  }
}
