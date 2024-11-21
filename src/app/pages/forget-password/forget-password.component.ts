import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators , AbstractControl , ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service'; // Import here
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { InputOtp } from 'primeng/inputotp';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule , InputOtp , RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  checkEmail: FormGroup;
  changePassword: FormGroup;

  toaster = inject(ToasterService)  ;
  hideCheckForm: boolean = false;


  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.checkEmail = this.fb.group({
      email: ['', [Validators.required]]
    });

    this.changePassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      otp: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  onSubmit() {
    if (this.checkEmail.valid) {
      console.log('Form Submitted', this.checkEmail.value);
      this.onUserCheck(this.checkEmail.value);
    } else {
      this.toaster.errorToaster('Please add your email or mobile number');
    }
  }

  onUserCheck(loginfrom: any) {
    this.hideCheckForm = true;
  }

  onOtpSubmit() {
    if (this.changePassword.valid) {
      console.log('Form Submitted', this.changePassword.value);
      this.onUserCheck(this.changePassword.value);
    } else {
      if (this.changePassword.hasError('passwordsDoNotMatch')) {
        this.toaster.errorToaster('Passwords do not match');
      } else {
        this.toaster.errorToaster('Please complete all fields');
      }
    }
  }

}
