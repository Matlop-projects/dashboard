
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DOCUMENT, NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslatePipe, NgIf, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ApiService]
})

export class LoginComponent {


  loginForm: FormGroup;
  toaster = inject(ToasterService);
  languageService = inject(LanguageService);
  currentLang = 'en';
  selectedLang: string = localStorage.getItem('lang') || 'en';



  constructor(private fb: FormBuilder, @Inject(DOCUMENT) private document: Document, private api: ApiService, private translate: TranslateService, private router: Router) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      loginMethod: [3]
    });

    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.initAppTranslation();
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.onLogin(this.loginForm.value);
    } else {
      this.toaster.errorToaster('Please Complete All Feilds');
    }
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
  }



  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  onLogin(loginfrom: { userName: string; password: string; loginMethod: number }) {
    this.api.adminLogin(loginfrom).subscribe({
      next: (res: any) => {
        const data = res?.data;
        if (!data?.accessToken) {
          localStorage.removeItem('token');
          this.toaster.errorToaster(res?.message || 'Login failed');
          return;
        }
        const dataUser: any = {
          img: data.imgSrc,
          id: data.userId,
          gender: data.genderName
        };
        localStorage.setItem('userData', JSON.stringify(dataUser));
        localStorage.setItem('token', data.accessToken);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        localStorage.removeItem('token');
      }
    });
  }

}
