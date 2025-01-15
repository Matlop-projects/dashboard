import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, take, catchError, throwError } from 'rxjs';
import { ToasterService } from './toaster.service';

export interface IOptions {
  showAlert: boolean;
  message: string;
}

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private toaster = inject(ToasterService);

  constructor(private http: HttpClient) {}

  login(object: any): Observable<any> {
    return this.http.post(baseUrl + `Authentication/login`, object).pipe(
      take(1),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message || 'Login failed');
        return throwError(() => error);
      })
    );
  }

  post<T>(APIName: string, body: any, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    return this.http.post(`${baseUrl}${APIName}`, body).pipe(
      take(1),
      map((res: any) => {
        options.showAlert ? this.toaster.successToaster(options.message) : '';
        return res;
      }),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message || 'Failed to perform POST operation');
        return throwError(() => error);
      })
    );
  }

  get<T>(APIName: string, params?: any, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    let queryParams: any = [];
    if (params) {
      for (const key in params) {
        queryParams.push(`${key}=${params[key]}`);
      }
    }
    return this.http.get(`${baseUrl}${APIName}?${queryParams.join('&')}`).pipe(
      take(1),
      map((res: any) => {
        options.showAlert ? this.toaster.successToaster(options.message) : '';
        return res;
      }),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message || 'Failed to perform GET operation');
        return throwError(() => error);
      })
    );
  }

  put<T>(APIName: string, body: any, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    return this.http.put(`${baseUrl}${APIName}`, body).pipe(
      take(1),
      map((res: any) => {
        options.showAlert ? this.toaster.successToaster(options.message) : '';
        return res;
      }),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message || 'Failed to perform PUT operation');
        return throwError(() => error);
      })
    );
  }

  putWithId<T>(APIName: string, id: any, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    return this.http.put(`${baseUrl}${APIName}=${id}`, {}).pipe(
      take(1),
      map((res: any) => {
        options.showAlert ? this.toaster.successToaster(options.message) : '';
        return res;
      }),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message || 'Failed to perform PUT operation');
        return throwError(() => error);
      })
    );
  }

  delete<T>(APIName: string, id: string, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    return this.http.delete(`${baseUrl}${APIName}=${id}`).pipe(
      take(1),
      map((res: any) => {
        options.showAlert ? this.toaster.successToaster(options.message) : '';
        return res;
      }),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message || 'Failed to perform DELETE operation');
        return throwError(() => error);
      })
    );
  }
}
