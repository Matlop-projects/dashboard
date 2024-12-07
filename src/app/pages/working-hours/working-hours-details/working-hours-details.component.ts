import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { DatePickerComponent } from "../../../components/time-picker/time-picker.component";
import { ToasterService } from '../../../services/toaster.service';
import { parseISO } from 'date-fns';


@Component({
  selector: 'app-working-hours-details',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, NgIf, RouterModule, BreadcrumpComponent, DatePickerComponent],
  templateUrl: './working-hours-details.component.html',
  styleUrl: './working-hours-details.component.scss'
})
export class WorkingHoursDetailsComponent {

  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToasterService);

  form = new FormGroup({
    startDate: new FormControl(null, {
      validators: [
        Validators.required
      ],
    }),
    endDate: new FormControl(null, {
      validators: [
        Validators.required
      ]
    })
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Working Hours',
      },
    ]
  }

  get workingHoursId() {
    return this.route.snapshot.params['id'];
  }

  ngOnInit() {
    console.log(this.router.url)
    if (this.tyepMode() !== 'add')
      this.getWorkingHours();
  }

  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit')) {
      this.bredCrumb.crumbs[1].label = 'Edit Working Hours';
      return 'edit'
    } else if (url.includes('view')) {
      this.bredCrumb.crumbs[1].label = 'View Working Hours';
      return 'view'
    } else {
      this.bredCrumb.crumbs[1].label = 'Add Working Hours';
      return 'add'
    }

  }

  getWorkingHours() {
    this.ApiService.get(`WorkingTime/GetWorkingTime/${this.workingHoursId}`).subscribe((res: any) => {
      if (res && res.data) {
        const { startDate, endDate, ...otherData } = res.data;

        const startDateObj = parseISO(startDate);
        const endDateObj = parseISO(endDate);

        this.form.patchValue({
          ...otherData,
          startDate: startDateObj,
          endDate: endDateObj,
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValues = this.form.value;

      const payload = {
        ...formValues,
        startDate: this.convertToLocalISOString(formValues.startDate),
        endDate: this.convertToLocalISOString(formValues.endDate),
        workTimeId: this.workingHoursId,
      };

      if (this.tyepMode() === 'add') {
        this.addWorkingHour(payload);
      } else {
        this.editWorkingHours(payload);
      }
    } else {
      this.toaster.errorToaster('Please Complete All form Feilds');
    }
  }



  addWorkingHour(payload: any) {
    this.ApiService.post('WorkingTime/CreateWorkingTime', payload, { showAlert: true, message: 'Working Hours Added Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('working_hours')
    })
  }

  editWorkingHours(payload: any) {
    this.ApiService.put('WorkingTime/UpdateWorkingTime', payload, { showAlert: true, message: 'Working Hours Updated Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('working_hours')
    })
  }


  convertTimeToDate(isoString: string): Date {
    const utcDate = new Date(isoString);
    const hours = utcDate.getUTCHours();
    const minutes = utcDate.getUTCMinutes();

    const localDate = new Date();
    localDate.setHours(hours, minutes, 0, 0);

    return localDate;
  }

  convertToLocalISOString(date: any): string {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localTime = new Date(date.getTime() - offsetMs);
    return localTime.toISOString().slice(0, -1);
  }
}
