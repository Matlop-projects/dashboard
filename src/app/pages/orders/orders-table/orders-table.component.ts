import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe, NgIf } from '@angular/common';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { order_status } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePicker } from 'primeng/datepicker';

const global_pageName = 'order.pageName'
const global_router_edit_url = '/order/edit'
const global_API_getAll = 'order/GetAllWitPaginationDashboard'

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [TableComponent, NgIf, SelectComponent, TitleCasePipe, TranslatePipe, PaginationComponent, FormsModule, ReactiveFormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent, DatePicker],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent {

  pageName = signal<string>(global_pageName);
  orderStatus = order_status
  clientList: any[] = []
  packageList: any[] = []
  countryList: any[] = []
  showFilter: boolean = false
  
  // FormControls for select components
  countryControl = new FormControl();
  clientControl = new FormControl();
  orderStatusControl = new FormControl();
  packageControl = new FormControl();
  nextVistTimeControl = new FormControl();
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
    crumbs: []
  }

  statuses = [
    {
      id: 0,
      color: '#c1cd6a',
      nameAr: 'قيد الانتظار',
      nameEn: 'Pending'
    },
    {
      id: 1,
      color: '#c1cd6a',
      nameAr: 'مدفوع',
      nameEn: 'Paid'
    },
    {
      id: 2,
      color: '#b16acd',
      nameAr: 'مخصص للمزود',
      nameEn: 'AssignedToProvider'
    },
    {
      id: 3,
      color: '#ccc053',
      nameAr: 'في الطريق',
      nameEn: 'InTheWay'
    },
    {
      id: 4,
      color: '#9b9d9c',
      nameAr: 'محاولة حل المشكلة',
      nameEn: 'TryingSolveProblem'
    },
    {
      id: 5,
      color: '#49e97c',
      nameAr: 'محلول',
      nameEn: 'Solved'
    },
    {
      id: 6,
      color: '#49e97c',
      nameAr: 'تأكيد العميل',
      nameEn: 'ClientConfirmation'
    },
    {
      id: 7,
      color: '#49e97c',
      nameAr: 'مكتمل',
      nameEn: 'Completed'
    },
    {
      id: 8,
      color: '#e94949',
      nameAr: 'ملغي',
      nameEn: 'Canceled'
    },
    {
       id: 9,
      color: '#c1cd19ff',
      nameAr: 'لم يحضر',
      nameEn: 'NoAttendance'
    }
  ];


  objectSearch: {
    pageNumber: number;
    countryId: number | null;
    pageSize: number;
    sortingExpression: string;
    sortingDirection: number;
    clientId: number | null;
    orderStatus: number | null;
    nextVistTime: Date | null;
    packageId: number | null;
  } = {
    pageNumber: 0,
    countryId: null,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    clientId: null,
    orderStatus: null,
    nextVistTime: null,
    packageId: null,
  };

  // Store filter key
  private readonly FILTER_STORAGE_KEY = 'ordersFilter';

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];
  maxDate = new Date();


  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.loadFilterFromStorage(); // Load saved filter first
    this.getAllCountry()
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

  // Load filter from localStorage
  loadFilterFromStorage() {
    const savedFilter = localStorage.getItem(this.FILTER_STORAGE_KEY);
    if (savedFilter) {
      try {
        const parsedFilter = JSON.parse(savedFilter);
        // Merge saved filter with default, keeping pageNumber from default
        this.objectSearch = {
          ...this.objectSearch,
          ...parsedFilter,
          pageNumber: 0 // Always start from first page
        };
        
        // Convert date string back to Date object if needed
        if (parsedFilter.nextVistTime) {
          this.objectSearch.nextVistTime = new Date(parsedFilter.nextVistTime);
        }
        
        // Set the values to FormControls
        if (parsedFilter.countryId) {
          this.countryControl.setValue(parsedFilter.countryId);
        }
        if (parsedFilter.clientId) {
          this.clientControl.setValue(parsedFilter.clientId);
        }
        if (parsedFilter.orderStatus !== null && parsedFilter.orderStatus !== undefined) {
          this.orderStatusControl.setValue(parsedFilter.orderStatus);
        }
        if (parsedFilter.packageId) {
          this.packageControl.setValue(parsedFilter.packageId);
        }
        if (parsedFilter.nextVistTime) {
          this.nextVistTimeControl.setValue(new Date(parsedFilter.nextVistTime));
        }
      } catch (error) {
        console.error('Error loading filter from storage:', error);
      }
    }
  }

  // Save filter to localStorage
  saveFilterToStorage() {
    try {
      localStorage.setItem(this.FILTER_STORAGE_KEY, JSON.stringify(this.objectSearch));
    } catch (error) {
      console.error('Error saving filter to storage:', error);
    }
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
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
      { keyName: 'totalWithAdditional', header: this.languageService.translate('order.form.price'), type: EType.text, show: true },
      { keyName: 'packageName', header: this.languageService.translate('order.form.pkg'), type: EType.text, show: true },
      { keyName: 'creationTime', header: this.languageService.translate('order.form.date'), type: EType.date, show: true },
      { keyName: currentLang === 'ar' ? 'serviceNameAr' : 'serviceNameEn', header: this.languageService.translate('SERVICE_NAME'), type: EType.text, show: true },
      { keyName: 'nextVistDate', header: this.languageService.translate('nextVisit'), type: EType.customeDate, show: true },
      { keyName: 'visitNumber', header: this.languageService.translate('visitNumber'), type: EType.text, show: true },
      { keyName: currentLang === 'ar' ? 'orderStatusAr' : 'orderStatusEn', header: this.languageService.translate('order.form.order_status'), type: EType.orderStatus, show: true },
      { keyName: 'showOrderStatusButton', header: this.languageService.translate('Status_Action'), type: EType.changeOrderStatus, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'orderId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'clientName', header: this.languageService.translate('order.form.client_name'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'totalWithAdditional', header: this.languageService.translate('order.form.price'), type: EType.text, showAs: ETableShow.content }
    ];
  }

  getAllCountry(){
    this.ApiService.get('Country/GetAll').subscribe((res: any) => {
      if (res.data) {
        this.countryList = res.data.map((item: any) => ({
          name: this.selectedLang == 'ar' ? item.arName : item.enName,
          code: item.countryId,
        }));
        
        // Re-apply saved filter value after list is loaded
        if (this.objectSearch.countryId) {
          this.countryControl.setValue(this.objectSearch.countryId);
        }
      }
    });
  }

  getAllClients() {
    this.ApiService.get('Client/GetAllActive').subscribe((res: any) => {
      this.clientList = []
      if (res.data)
        res.data.map((item: any) => {
          this.clientList.push({
            name: item.firstName,
            code: item.userId
          })
        })
      
      // Re-apply saved filter value after list is loaded
      if (this.objectSearch.clientId) {
        this.clientControl.setValue(this.objectSearch.clientId);
      }
    })
  }

  getAllPackages() {
    this.ApiService.get('Package/GetAllPackage').subscribe((res: any) => {
      this.packageList = []
      if (res.data)
        res.data.map((item: any) => {
          this.packageList.push({
            name: this.selectedLang == 'en' ? item.nameEn : item.nameAr,
            code: item.packageId
          })
        })
      
      // Re-apply saved filter value after list is loaded
      if (this.objectSearch.packageId) {
        this.packageControl.setValue(this.objectSearch.packageId);
      }
    })
  }

  onSelectedValue(selectedItem: any, value: string) {
    if (value == 'package') {
      this.objectSearch.packageId = selectedItem;
    }
    else if (value == 'status') {
      this.objectSearch.orderStatus = selectedItem;
    }
    else if (value == 'country') {
      this.objectSearch.countryId = selectedItem
    }
    else if (value == 'clinet') {
      this.objectSearch.clientId = selectedItem
    } else {
      console.log(selectedItem);
      const localDate = new Date(selectedItem);
      const year = localDate.getFullYear();
      const month = localDate.getMonth();
      const day = localDate.getDate();
      // Set the time to noon (12:00) to avoid shifting the day when converting to UTC
      this.objectSearch.nextVistTime = new Date(year, month, day, 12);

    }
  }

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }


  API_getAll() {
    console.log(this.objectSearch);

    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.dataList;
        this.totalCount = res.data.totalCount;

        // Iterate over each data item
        this.dataList.forEach((data: any) => {
          // For example, copying visitNumber from nested package object
          data.visitNumber = data.package.visitNumber;

          // Find the matching status object using the orderStatusEnum property
          const statusObj = this.statuses.find((status: any) => status.id === data.orderStatusEnum);
          if (statusObj) {
            // Create two new properties with Arabic and English values
            data.orderStatusAr = statusObj.nameAr;
            data.orderStatusEn = statusObj.nameEn;
          }

          if (data.paymentWayId == 1 && data.orderStatusEnum == 0) {
            data.showOrderStatusButton = true
          } else {
            data.showOrderStatusButton = false
          }
        });

        this.filteredData = [...this.dataList];
        console.log(this.dataList);
      }
    });
  }


  onPageChange(event: any) {
    console.log(event);
    this.objectSearch.pageNumber = event;
    this.saveFilterToStorage(); // Save filter when changing pages
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
    this.saveFilterToStorage(); // Save filter when applying
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      "pageNumber": 0,
      "pageSize": 8,
      "sortingExpression": "",
      "sortingDirection": 0,
      "countryId": null,
      // "technicalId": null,
      "clientId": null,
      nextVistTime: null,
      // "paymentWayId": null,
      "orderStatus": null,
      "packageId": null,
      // "coponeId": null,
      // "orderSubTotal": null,
      // "orderTotal": null,
      // "locationId": null
    }
    
    // Reset FormControls
    this.countryControl.setValue(null);
    this.clientControl.setValue(null);
    this.orderStatusControl.setValue(null);
    this.packageControl.setValue(null);
    this.nextVistTimeControl.setValue(null);
    
    localStorage.removeItem(this.FILTER_STORAGE_KEY); // Clear saved filter
    this.API_getAll();
    this.showFilter = false
  }

  reloadGetAllApi(e: any) {
    if (e) {
      this.API_getAll();
    }
  }

}
































