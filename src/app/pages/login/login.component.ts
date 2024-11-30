
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service'; // Import here
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule , RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers:[ApiService]
})
export class LoginComponent {
  loginForm: FormGroup;
  toaster = inject(ToasterService)  ;


  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      userName: ['superadmin@admin.com', [Validators.required]],
      password: ['Admin@VL', [Validators.required]],
      loginMethod: [2]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);
      this.onLogin(this.loginForm.value);
    } else {
      this.toaster.errorToaster('Please Complete All Feilds');
    }
  }

  onLogin(loginfrom: any) {
    this.api.login(loginfrom).subscribe((res: any) => {
      localStorage.setItem('token', res.data.accessToken);
      this.router.navigate(['/working_hours']);
    },
      err => {
        localStorage.removeItem('token');
        console.log(err);
        this.toaster.errorToaster(err.message)
      })
  }

}
