import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DOCUMENT, NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { API } from '../../core/api-endpoints';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslatePipe, NgIf, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  loginForm: FormGroup;
  selectedLang: string = localStorage.getItem('lang') || 'en';

  private toaster = inject(ToasterService);
  private languageService = inject(LanguageService);
  private api = inject(ApiService);
  private router = inject(Router);

  constructor(private fb: FormBuilder, @Inject(DOCUMENT) private document: Document) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initAppTranslation();

    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.onLogin();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  toggleLanguage(): void {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.languageService.change(this.selectedLang);
    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.setAttribute('lang', this.selectedLang);
    this.document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
  }

  private initAppTranslation(): void {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  private onLogin(): void {
    const body = {
      usernameOrEmail: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password,
    };

    this.api.post<any>(API.AUTH.ADMIN_LOGIN, body).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          const userData = {
            id: res.data.userId,
            fullName: res.data.fullName,
            email: res.data.email,
            roleId: res.data.roleId,
            roleName: res.data.roleName,
          };
          localStorage.setItem('token', res.data.accessToken);
          localStorage.setItem('userData', JSON.stringify(userData));
          this.toaster.successToaster('Login successful');
          this.router.navigate(['/dashboard']);
        } else {
          this.toaster.errorToaster(res.message || 'Login failed');
        }
      },
      error: () => {
        // Error interceptor will handle the toast
      }
    });
  }
}
