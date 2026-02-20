import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';
import { API } from '../../core/api-endpoints';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf, OtpModalComponent, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  checkMobile: FormGroup;
  changePassword: FormGroup;
  hideCheckForm = false;
  openOtpModal = false;

  private toaster = inject(ToasterService);
  private api = inject(ApiService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.checkMobile = this.fb.group({
      mobileNumber: ['', [Validators.required]]
    });

    this.changePassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  onSubmit(): void {
    if (this.checkMobile.valid) {
      const mobileNumberObject = {
        mobileNumber: this.checkMobile.value.mobileNumber
      };
      this.api.post(API.AUTH.FORGOT_PASSWORD, mobileNumberObject).subscribe((res: any) => {
        if (res.status) {
          this.openOtpModal = true;
        } else {
          this.toaster.errorToaster(res.message);
        }
      });
    } else {
      this.toaster.errorToaster('Please add your mobile number');
    }
  }

  onOtpSubmit(): void {
    if (this.changePassword.valid) {
      this.changePassword.value.mobileNumber = this.checkMobile.get('mobileNumber')?.value;
      this.api.post(API.AUTH.RESET_PASSWORD, this.changePassword.value).subscribe((data: any) => {
        this.toaster.successToaster(data.message);
        this.router.navigate(['/auth/login']);
      });
    } else {
      if (this.changePassword.hasError('passwordsDoNotMatch')) {
        this.toaster.errorToaster('Passwords do not match');
      } else {
        this.toaster.errorToaster('Please complete all fields');
      }
    }
  }

  getOtpValue(e: any): void {
    const otpObject = {
      mobile: this.checkMobile.get('mobileNumber')?.value,
      otpCode: e.otpValue
    };
    this.api.post(API.AUTH.VERIFY_RESET_CODE, otpObject).subscribe((data: any) => {
      if (data.message === 'Otp Is Not Valid') {
        this.toaster.errorToaster(data.message);
      } else {
        this.hideCheckForm = true;
        this.openOtpModal = false;
      }
    });
  }

  resendOtp(e: any): void {
    this.onSubmit();
  }
}
