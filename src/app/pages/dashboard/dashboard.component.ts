import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ NgFor , RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private ApiService = inject(ApiService);

  ngOnInit(): void {
    this.getDashboardDetails();
  }

  items: any[] = [
    { name: 'Client Count', value: 0, img: 'assets/images/dashboard/client.png', route: '/clients', id: 'clientCount' },
    { name: 'Technical Count', value: 0, img: 'assets/images/dashboard/technical-support.png', route: '/technicals', id: 'technicalCount' },
    { name: 'Order Count', value: 0, img: 'assets/images/dashboard/checklist.png', route: '/dashboard', id: 'orderCount' },
    { name: 'Contract Type Count', value: 0, img: 'assets/images/dashboard/contract.png', route: '/contract-type', id: 'contractTypeCount' },
    { name: 'Package Count', value: 0, img: 'assets/images/dashboard/package.png', route: '/package', id: 'packageCount' },
    { name: 'Payment Way Count', value: 0, img: 'assets/images/dashboard/payment-method.png', route: '/paymentWay', id: 'paymentWayCount' },
    { name: 'Service Count', value: 0, img: 'assets/images/dashboard/customer-service.png', route: '/services', id: 'serviceCount' },
    { name: 'Working Time Count', value: 0, img: 'assets/images/dashboard/timetable.png', route: '/working_hours', id: 'workingTimeCount' },
    { name: 'Terms and Conditions Count', value: 0, img: 'assets/images/dashboard/terms-and-conditions.png', route: '/settings/terms_conditions', id: 'termsAndConditionsCount' },
    { name: 'Technical Specialist Count', value: 0, img: 'assets/images/dashboard/public-relations.png', route: '/technical-specialist', id: 'technicalSpecialistCount' },
    { name: 'Order Additional Items Count', value: 0, img: 'assets/images/dashboard/checklist.png', route: '/dashboard', id: 'orderAdditionalItemsCount' },
    { name: 'FAQs Count', value: 0, img: 'assets/images/dashboard/faq.png', route: '/settings/faqs', id: 'faQsCount' },
    { name: 'Country Count', value: 0, img: 'assets/images/dashboard/coronavirus.png', route: '/country', id: 'countryCount' },
    { name: 'Coupon Count', value: 0, img: 'assets/images/dashboard/coupons.png', route: '/copone', id: 'coponeCount' },
    { name: 'Complaint Count', value: 0, img: 'assets/images/dashboard/bad.png', route: '/complaint', id: 'complaintCount' },
    { name: 'City Count', value: 0, img: 'assets/images/dashboard/cityscape.png', route: '/city', id: 'cityCount' },
    { name: 'Cancel Reason Count', value: 0, img: 'assets/images/dashboard/no-data.png', route: '/cancel-reason', id: 'cancelReasonCount' }
  ];




  getDashboardDetails() {
    this.ApiService.post('Dashborad/GetAll', {}).subscribe((res: any) => {
      console.log(res);
      this.updateItemsWithData(res.data);

    })
  }
  updateItemsWithData(data: any) {
    this.items.forEach((item: any) => {
      if (data.hasOwnProperty(item.id)) {
        item.value = data[item.id];
      }
    });
  }

}
