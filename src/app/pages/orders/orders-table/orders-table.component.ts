import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe, NgIf } from '@angular/common';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { order_status } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName = 'order.pageName'
const global_router_edit_url = '/order/edit'
const global_API_getAll =   'order/GetAllWitPaginationDashboard'

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [TableComponent,NgIf,SelectComponent, TitleCasePipe,TranslatePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent {

  pageName = signal<string>(global_pageName);
  orderStatus=order_status
  clientList:any[]=[]
  packageList:any[]=[]
  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.edit,
      apiName_or_route: global_router_edit_url,
      autoCall: true
    },
    // {
    //   name: EAction.delete,
    //   apiName_or_route: 'Order/Deleteorder/',
    //   autoCall: true
    // },
  ]
  private ApiService = inject(ApiService)


  bredCrumb: IBreadcrumb = {
    crumbs: [ ]
  }

  objectSearch = {
    "pageNumber": 0,
    "pageSize": 8,
    "sortingExpression": "",
    "sortingDirection": 0,
    // "technicalId": null,
    "clientId":null,
    // "paymentWayId": null,
    "orderStatus": null,
    "packageId": null,
    // "coponeId": null,
    // "orderSubTotal": null,
    // "orderTotal": null,
    // "locationId": null
  }

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_pageName)
    this.API_getAll();
    this.getAllClients()
    this.getAllPackages()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang);
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getAllClients();
      this.getAllPackages();
      this.getBreadCrumb();
    })
}

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label:  this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName()),
        },
      ]
    }
  }


  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'orderId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'clientName', header: this.languageService.translate('order.form.client_name'), type: EType.text, show: true },
      { keyName: 'paymentWayName', header: this.languageService.translate('order.form.paymentWay'), type: EType.text, show: true },
      { keyName: 'orderTotal', header: this.languageService.translate('order.form.price'), type: EType.text, show: true },
      { keyName: 'packageName', header: this.languageService.translate('order.form.pkg'), type: EType.text, show: true },
      { keyName: 'creationTime', header: this.languageService.translate('order.form.date'), type: EType.date, show: true },
      { keyName: 'orderStatusName', header: this.languageService.translate('order.form.order_status'), type: EType.orderStatus, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'orderId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'clientName', header: this.languageService.translate('order.form.client_name'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'orderTotal', header: this.languageService.translate('order.form.price'), type: EType.text, showAs: ETableShow.content }
    ];
  }


  getAllClients(){
   this.ApiService.get('Client/GetAllActive').subscribe((res:any)=>{
    this.clientList=[]
    if(res.data)
      res.data.map((item:any)=>{
    this.clientList.push({
      name:item.firstName,
      code:item.userId
    })
    })
   })
  }

  getAllPackages(){
    this.ApiService.get('Package/GetAllPackage').subscribe((res:any)=>{
      this.packageList=[]
      if(res.data)
        res.data.map((item:any)=>{
      this.packageList.push({
        name:this.selectedLang=='en' ?item.nameEn:item.nameAr,
        code:item.packageId
      })
      })
     })
  }
  onSelectedValue(selectedItem:any,value:string){
      if(value=='package')
        this.objectSearch.packageId=selectedItem
      else   if(value=='status')
        this.objectSearch.orderStatus=selectedItem
      else
      this.objectSearch.clientId=selectedItem

  }

  openFilter() {
    this.showFilter = true
    this.objectSearch.clientId=null
    this.objectSearch.orderStatus=null
    this.objectSearch.packageId=null


  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  API_getAll() {
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.dataList];
        console.log( this.dataList);

      }

    })
  }

  onPageChange(event: any) {
    console.log(event);
    this.objectSearch.pageNumber = event;
    this.API_getAll();
  }

  filterData() {
    this.dataList = this.filteredData;
    const search = this.searchValue.toLowerCase();

    if (this.searchValue.length == 1) {
      this.dataList = this.filteredData;
      return;
    }

    this.dataList = this.dataList.filter((item: any) =>
      item.enTitle.toLowerCase().includes(search) ||
      item.arTitle.toLowerCase().includes(search) ||
      item.enDescription.toLowerCase().includes(search) ||
      item.arDescription.toLowerCase().includes(search)
    );
  }

  onSubmit() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      "pageNumber": 0,
      "pageSize": 8,
      "sortingExpression": "",
      "sortingDirection": 0,
      // "technicalId": null,
      "clientId":null,
      // "paymentWayId": null,
      "orderStatus": null,
      "packageId": null,
      // "coponeId": null,
      // "orderSubTotal": null,
      // "orderTotal": null,
      // "locationId": null
    }
    this.API_getAll();
    this.showFilter = false
  }

}
































