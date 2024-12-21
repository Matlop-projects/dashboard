import { Component, inject } from '@angular/core';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { IDialog } from '../../../components/modal/modal.interface';
import { ModalComponent } from '../../../components/modal/modal.component';
import { ToasterService } from '../../../services/toaster.service';
import { Editor } from 'primeng/editor';
import { InputNumber } from 'primeng/inputnumber';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-special-order-details',
  standalone: true,
  imports: [BreadcrumpComponent, Editor, InputNumber, InputIcon, IconField, FormsModule, RouterModule, CommonModule, Select, FormsModule, Tooltip, ModalComponent],
  templateUrl: './special-order-details.component.html',
  styleUrl: './special-order-details.component.scss'
})
export class SpecialOrderDetailsComponent {

  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tosater = inject(ToasterService);
  private imageUrl = environment.baseImageUrl


  showConfirmMessage: boolean = false;
  clientDetails: any;

  bredCrumb: IBreadcrumb = {
    crumbs: [
      { label: 'Home', routerLink: '/dashboard' },
      { label: 'Order' },
    ]
  };


  dialogProps: IDialog = {
    props: { visible: false },
    onHide: () => { },
    onShow: () => { }
  };



  statuses = [
    { name: 'Pending', id: 1, color: '#c1cd6a' },
    { name: 'Completed', id: 2, color: '#3fac4e' },
    { name: 'Canceled', id: 3, color: '#c32722' }
  ];

  orderStatusValue: any;
  orderDetails: any;
  orderTechnicalAssignments: any;
  providerList: any;
  providerValue: any;
  providerCase = 'new'

  providerObject = {
    specialOrderTechnicalAssignmentId: 0,
    orderId: 0,
    technicalId: 0
  };

  orderAmount: number = 1;
  imageList: any;




  providerTitle = 'Add New Provider';

  orderTimeSchedule: any;

  ngOnInit() {
    this.getSpecialOrderDetails();
    this.getTechnicalList();
  }

  get orderId(): number {
    const id = this.route.snapshot.params['id'];
    this.providerObject.orderId = +id;
    return +id;
  }

  typeMode(): string {
    const url = this.router.url;
    if (url.includes('edit')) {
      this.bredCrumb.crumbs[1].label = 'Edit Order';
      return 'edit';
    } else {
      this.bredCrumb.crumbs[1].label = 'View Order';
      return 'view';
    }
  }

  getSpecialOrderDetails() {
    this.ApiService.get(`SpecialOrder/Get/${this.orderId}`).subscribe((res: any) => {
      if (res && res.data) {
        this.orderDetails = res.data;
        this.orderAmount = res.data.amount;
        this.imageList = res.data.media;
        this.addUrltoMedia(this.imageList);
        this.setOrderStatusById(res.data.specialOrderStatus);
        this.getClientData(res.data.clientId);
        this.getAllProviders();
      }
    });
  }

  addUrltoMedia(list: any) {
    console.log( this.imageList);
    list.forEach((data: any) => {
       data.src = this.imageUrl + data.src;
    });
    console.log( this.imageList);

  }

  getClientData(clientId: string) {
    this.ApiService.get(`Client/GetById/${clientId}`).subscribe((res: any) => {
      if (res && res.data) {
        this.clientDetails = res.data;
      }
    });
  }

  viewClientDetails(clientId: string) {
    this.router.navigate(['/client/edit/', clientId]);
  }

  dialNumber(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
  }

  onStatusChange() {
    this.ApiService.put(
      `SpecialOrder/ChangeStatus?SpecialOrderId=${this.orderId}&SpecialOrderStatus=${this.orderStatusValue.id}`,
      {}
    ).subscribe(() => {
      this.getSpecialOrderDetails();
      this.tosater.successToaster('Order Status Updated Successfully')
    });
  }

  setOrderStatusById(id: number): void {
    this.orderStatusValue = this.statuses.find(status => status.id === id);
  }

  getColorById(id: number): string | null {
    const status = this.statuses.find(s => s.id === id);
    return status ? status.color : null;
  }

  convertDate(originalDate: string): string {
    const date = new Date(originalDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  openTechnicalModal() {
    this.providerTitle = 'Add New Provider';
    this.providerCase = 'new';
    this.dialogProps.props.visible = true;
  }

  getTechnicalList() {
    this.ApiService.get('Technical/GetAllActive').subscribe((res: any) => {
      this.providerList = res.data;
    });
  }

  addNewTechnical() {
    this.providerObject.specialOrderTechnicalAssignmentId = 0;
    this.ApiService.post('Order/CreateAssignTechnical', this.providerObject).subscribe(() => {
      this.getSpecialOrderDetails();
      this.dialogProps.props.visible = false;
      this.tosater.successToaster('Provider Added Successfully')
    });
  }

  editTechnical() {
    this.ApiService.put('Order/UpdateAssignTechnical', this.providerObject).subscribe(() => {
      this.getSpecialOrderDetails();
      this.dialogProps.props.visible = false;
      this.tosater.successToaster('Provider Updated Successfully')
    });
  }

  onProviderChange() {
    this.providerObject.technicalId = this.providerValue.userId;
    if (this.providerCase == 'new') {
      this.addNewTechnical();
    } else {
      this.editTechnical();
    }
  }

  getAllProviders() {
    this.ApiService.get( `SpecialOrder/GetAllAssignTechnicals/${this.orderId}`).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res.data);
      }
    });
  }

  editProvider(technicalId: number, specialOrderTechnicalAssignmentId: any) {
    this.providerObject.specialOrderTechnicalAssignmentId = specialOrderTechnicalAssignmentId;
    this.dialogProps.props.visible = true;
    this.providerTitle = 'Edit Provider';
    this.providerCase = 'edit';
    this.setTechnicalById(technicalId);
  }

  setTechnicalById(id: number): void {
    this.providerValue = this.providerList.find((data: any) => data.userId === id);
  }

  getStatus(statusId: number) {
    if (statusId == 1) {
      return 'Pending'
    } else if (statusId == 2) {
      return 'Completed'
    } else {
      return 'Canceled'
    }
  }


  changeAmount() {
    if (this.orderAmount == 0) {
      this.tosater.errorToaster("Amount can't be 0");
    } else if (this.orderAmount == null || this.orderAmount == undefined) {
      this.tosater.errorToaster('You have to add amount');
    } else {
      this.orderDetails.amount = this.orderAmount;
      this.ApiService.put(
        `SpecialOrder/Update`,
        this.orderDetails
      ).subscribe(() => {
        this.getSpecialOrderDetails();
        this.tosater.successToaster('Order Amount Updated Successfully')
      });
    }
  }

}

