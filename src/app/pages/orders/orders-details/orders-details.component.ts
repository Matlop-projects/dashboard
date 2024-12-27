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


@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [BreadcrumpComponent, RouterModule,Editor, CommonModule, Select, FormsModule, Tooltip, ModalComponent],
  templateUrl: './orders-details.component.html',
  styleUrl: './orders-details.component.scss'
})
export class OrdersDetailsComponent {
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tosater = inject(ToasterService);


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

  additinalModal: IDialog = {
    props: { visible: false },
    onHide: () => { },
    onShow: () => { }
  };

  statuses = [
    { name: 'Pending', id: 0, color: '#c1cd6a' },
    { name: 'Paid', id: 1, color: '#c1cd6a' },
    { name: 'AssignedToProvider', id: 2, color: '#b16acd' },
    { name: 'InTheWay', id: 3, color: '#ccc053' },
    { name: 'TryingSolveProblem', id: 4, color: '#9b9d9c' },
    { name: 'Solved', id: 5, color: '#49e97c' },
    { name: 'ClientConfirmation', id: 6, color: '#49e97c' },
    { name: 'Completed', id: 7, color: '#49e97c' },
    { name: 'Canceled', id: 8, color: '#e94949' }
  ];

  orderStatusValue: any;
  orderDetails: any;
  orderTechnicalAssignments: any;
  providerList: any;
  providerValue: any;
  providerCase = 'new'

  providerObject = {
    orderTechnicalAssignmentId: 0,
    orderId: 0,
    technicalId: 0
  };

  additionalObject = {
    "orderId": 0,
    "orderAddtionalItemId": 0,
    "additionalPrice": 0,
    "note": ""
  }

  additonalItemList: any;
  additonalCase = 'new';
  additonalTitle = 'Add Additonal Item'

  providerTitle = 'Add New Provider';

  orderTimeSchedule: any;

  ngOnInit() {
    this.getOrderDetails();
    this.getTechnicalList();
    this.getOrderTimeSchedule();
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

  getOrderDetails() {
    this.ApiService.get(`Order/Get/${this.orderId}`).subscribe((res: any) => {
      if (res && res.data) {
        this.orderDetails = res.data;
        this.orderTechnicalAssignments = res.data.orderTechnicalAssignments;
        this.additonalItemList = res.data.orderAddtionalItem;
        this.setOrderStatusById(res.data.orderStatusEnum);
        this.getClientData(res.data.clientId);
      }
    });
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
      `Order/ChangeStatus?OrderId=${this.orderId}&orderStatusEnum=${this.orderStatusValue.id}`,
      {}
    ).subscribe(() => {
      this.getOrderDetails();
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
    this.providerObject.orderTechnicalAssignmentId = 0;
    this.ApiService.post('Order/CreateAssignTechnical', this.providerObject).subscribe(() => {
      this.getOrderDetails();
      this.dialogProps.props.visible = false;
      this.tosater.successToaster('Provider Added Successfully')
    });
  }

  editTechnical() {
    this.ApiService.put('Order/UpdateAssignTechnical', this.providerObject).subscribe(() => {
      this.getOrderDetails();
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

  editProvider(technicalId: number, orderTechnicalAssignmentId: any) {
    this.providerObject.orderTechnicalAssignmentId = orderTechnicalAssignmentId;
    this.dialogProps.props.visible = true;
    this.providerTitle = 'Edit Provider';
    this.providerCase = 'edit';
    this.setTechnicalById(technicalId);
  }

  setTechnicalById(id: number): void {
    this.providerValue = this.providerList.find((data: any) => data.userId === id);
  }

  openAdditinaolModal() {
    this.additinalModal.props.visible = true;
    this.additonalCase = 'new';
    this.additonalTitle = 'Add Additonal Item';
  }

  addAdditinalItem() {
    this.ApiService.post('OrderAdditionalItems/Create', this.additionalObject).subscribe((res: any) => {
      console.log(res);
      this.getOrderDetails();
      this.additinalModal.props.visible = false;
      this.tosater.successToaster('Additinal Item Added Successfully')
    })
  }

  editAdditinalItem() {
    this.ApiService.put('OrderAdditionalItems/Update', this.additionalObject).subscribe((res: any) => {
      console.log(res);
      this.getOrderDetails();
      this.additinalModal.props.visible = false;
      this.tosater.successToaster('Additinal Item Updated Successfully')
    })
  }

  editAdditinal(item: any) {
    this.additionalObject = item;
    this.additinalModal.props.visible = true;
    this.additonalCase = 'edit';
    this.additonalTitle = 'edit Additonal Item';
  }

  getOrderTimeSchedule() {
    this.ApiService.get(`Order/GetOrderSchedule/${this.orderId}`).subscribe((res: any) => {
      console.log(res.data);
      this.orderTimeSchedule = res.data;
    })
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year} - ${formattedHours}:${minutes} ${amPm}`;
  }

  onSubmit(form: any) {
    this.additionalObject.orderId = this.orderId
    if (form.valid) {
      console.log('Form Submitted:', this.additionalObject);

      if (this.additonalCase == 'new') {
        this.addAdditinalItem();
      } else {
        this.editAdditinalItem();
      }
      form.resetForm();
    } else {
      console.log('Form is invalid');
    }
  }
}
