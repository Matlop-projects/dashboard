
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service'; // Import here
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OtpModalComponent,TranslatePipe, NgIf, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ApiService]
})
export class LoginComponent {
  loginForm: FormGroup;
  toaster = inject(ToasterService);
  otpValue: string = '';
  mobileNumber: string = '';
  openOtpModal: boolean = false;


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
      this.mobileNumber = res.mobilePhone;
      this.openOtpModal = res.status;
      if (!res.status) {
        localStorage.removeItem('token');
        this.toaster.errorToaster(res.message)
      }
    })
  }

  getOtpValue(e: any) {
    console.log(e);
    let otpObject = {
      "mobile": this.mobileNumber,
      "otpCode": e.otpValue
    }
    this.api.post('Authentication/VerfiyOtp', otpObject).subscribe((data: any) => {
      console.log(data.data);
      if(data.message == 'Otp Is Not Valid') {
        this.toaster.errorToaster(data.message)
      } else {
        let dataUser:any ={
          img:data.data.imgSrc,
          id:data.data.userId,
          gender:data.data.gender
        }
        localStorage.setItem('userData',JSON.stringify(dataUser))
        localStorage.setItem('token', data.data.accessToken);
        this.router.navigate(['/dashboard']);
      }
    })
  }

  resendOtp(e: any) {
    console.log(e);
    this.onSubmit();
  }

}
