import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/basic-auth.interceptor';
import { errorInterceptor } from './core/error.interceptor';
import { spinnerInterceptor } from './core/spinner.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';



const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor]) ,
    withInterceptors([spinnerInterceptor]) ,
    withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: Aura
    }),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })])
  ]
};
