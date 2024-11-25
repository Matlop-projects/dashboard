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

        // Convert the time strings to Date objects
        const startDateObj = this.convertTimeToDate(startDate);
        const endDateObj = this.convertTimeToDate(endDate);

        console.log('Converted Start Date:', startDateObj);
        console.log('Converted End Date:', endDateObj);

        // Patch the form with Date objects
        this.form.patchValue({
          ...otherData,
          startDate: startDateObj,  // Date object
          endDate: endDateObj       // Date object
        });
      }
    });
  }

  onSubmit() {
    console.log(this.form.value);

    if (this.form.valid) {
      const payload = {
        startDate: this.form.value.startDate, // String in "hh:mm:AM/PM" format
        endDate: this.form.value.endDate, // String in "hh:mm:AM/PM" format
        workTimeId: this.workingHoursId
      };
      if (this.tyepMode() === 'add') {
        this.addWorkingHour(payload);
      } else {
        this.editWorkingHours(payload);
      }
    } else {
      this.toaster.errorToaster('Please Complete All form Fields');
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


// Helper function to convert "hh:mm AM/PM" to Date object
convertTimeToDate(timeString: string): Date {
  const timeParts = timeString.match(/(\d{1,2}):(\d{2}) (AM|PM)/);
  if (timeParts) {
    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const period = timeParts[3];

    // Convert 12-hour format to 24-hour format
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);  // Set the hours and minutes
    return date;
  } else {
    return new Date();  // If no match, return current date
  }
}
}
