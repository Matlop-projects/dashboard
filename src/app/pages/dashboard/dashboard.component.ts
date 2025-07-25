import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Knob } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgFor,
    RouterModule,
    NgIf,
    TranslatePipe,
    TitleCasePipe,
    DatePickerModule,
    Knob,
    FormsModule,
    DialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private apiService = inject(ApiService);
  showExelDialog = false;
  staticDetails: any;
  fromDate: any;
  toDate: any;

  ngOnInit(): void {
    this.getDashboardDetails();
    this.getStaticData();
  }

  items: any[] = [
    {
      name: 'dashboard.client',
      value: 0,
      img: 'assets/images/dashboard/client.png',
      route: '/clients',
      id: 'clientCount',
    },
    {
      name: 'dashboard.technical',
      value: 0,
      img: 'assets/images/dashboard/technical-support.png',
      route: '/technicals',
      id: 'technicalCount',
    },
    {
      name: 'dashboard.order',
      value: 0,
      img: 'assets/images/dashboard/checklist.png',
      route: '/orders',
      id: 'orderCount',
    },
    // ... add other items here as needed
  ];

  getDashboardDetails() {
    this.apiService.get('Dashborad/GetAll').subscribe((res: any) => {
      this.updateItemsWithData(res.data);
    });
  }

  getStaticData() {
    this.apiService.get('Dashborad/GetAllOrderStatistics').subscribe(
      (res: any) => {
        this.staticDetails = res.data;
      }
    );
  }

  downloadExcel() {
  let params = {
    from: new Date(this.fromDate + 'T00:00:00Z').toISOString(),
    to: new Date(this.toDate + 'T00:00:00Z').toISOString(),
  };

  this.apiService.get('Order/ExportExcel', params).subscribe((res: any) => {
    console.log(res);

    if (res?.message) {
      const base64Data = res.message;
      const cleanedBase64 = base64Data.includes('base64,')
        ? base64Data.split('base64,')[1]
        : base64Data;

      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'orders.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showExelDialog = false;
    } else {
      console.error('No data received for Excel download.');
    }
  });
}


  downloadBase64File(base64Data: string, fileName: string, mimeType: string) {
    const cleanedBase64 = base64Data.includes('base64,')
      ? base64Data.split('base64,')[1]
      : base64Data;

    try {
      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error decoding base64 or creating blob:', error);
    }
  }

  updateItemsWithData(data: any) {
    this.items.forEach((item: any) => {
      if (data.hasOwnProperty(item.id)) {
        item.value = data[item.id];
      }
    });
  }

  onFromdateChange() {
    this.toDate = null;
  }
}
