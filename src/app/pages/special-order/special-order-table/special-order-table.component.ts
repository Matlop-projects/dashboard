import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import {  RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { NgIf, TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectComponent } from '../../../components/select/select.component';
import { special_order_enum, special_order_status } from '../../../conts';

const global_pageName = 'special_order.pageName'
const global_router_add_url_in_Table = '/special-order/add'
const global_router_view_url = 'special-order/view'
const global_router_edit_url = 'special-order/edit'
const global_API_getAll = 'specialOrder/GetAllWitPagination'
const global_API_delete = 'specialOrder/Delete?id'

@Component({
  selector: 'app-special-order-table',
  standalone: true,
  imports: [TableComponent,SelectComponent,NgIf, PaginationComponent, TitleCasePipe, TranslatePipe, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './special-order-table.component.html',
  styleUrl: './special-order-table.component.scss'
})
export class SpecialOrderTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);
  clientList:any[]=[]
  countryList: any[] = []
  specialOrderEnumList=special_order_enum
  specialOrderStatusList=special_order_status
  showFilter: boolean = false
  
  // FormControls for select components
  countryControl = new FormControl();
  clientControl = new FormControl();
  specialOrderEnumControl = new FormControl();
  specialOrderStatusControl = new FormControl();
  tableActions: ITableAction[] = [
    // {
    //   name: EAction.delete,
    //   apiName_or_route: global_API_delete,
    //   autoCall: true
    // },
    // {
    //   name: EAction.view,
    //   apiName_or_route: global_router_view_url,
    //   autoCall: true
    // },
    {
      name: EAction.edit,
      apiName_or_route: global_router_edit_url,
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService);



  bredCrumb: IBreadcrumb = {
    crumbs: [
    ]
  }

  statuses = [
    {
      id: 1,
      color: '#c1cd6a',
      nameAr: 'قيد الانتظار',
      nameEn: 'Pending'
    },
    {
      id: 2,
      color: '#3fac4e',
      nameAr: 'مكتمل',
      nameEn: 'Completed'
    },
    {
      id: 3,
      color: '#c32722',
      nameAr: 'ملغي',
      nameEn: 'Canceled'
    }
  ];

  objectSearch = {
    pageNumber: 0,
    countryId: null,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    specialOrderId:  null,//text
    //  amount: null,
    // media: null,
    clientId: null,//dr
    specialOrderEnum: null,
    specialOrderStatusEnum:null

  }

  // Store filter key
  private readonly FILTER_STORAGE_KEY = 'specialOrderFilter';

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];
  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.loadFilterFromStorage(); // Load saved filter first
    this.getAllCountry()
    this.pageName.set(global_pageName)
    this.API_getAll();
    this.getAllClients();
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getAllClients();
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
        
        // Set the values to FormControls
        if (parsedFilter.countryId) {
          this.countryControl.setValue(parsedFilter.countryId);
        }
        if (parsedFilter.clientId) {
          this.clientControl.setValue(parsedFilter.clientId);
        }
        if (parsedFilter.specialOrderEnum) {
          this.specialOrderEnumControl.setValue(parsedFilter.specialOrderEnum);
        }
        if (parsedFilter.specialOrderStatusEnum) {
          this.specialOrderStatusControl.setValue(parsedFilter.specialOrderStatusEnum);
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

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'specialOrderId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'amount', header: this.languageService.translate('special_order.form.amount'), type: EType.text, show: true },
      { keyName: 'clientId', header: this.languageService.translate('special_order.form.clientId'), type: EType.text, show: true },
      { keyName: 'creationTime', header: this.languageService.translate('order.form.date'), type: EType.date, show: true },
      // { keyName: currentLang === 'ar'  ? 'serviceNameAr' : 'serviceNameEn', header: this.languageService.translate('SERVICE_NAME'), type: EType.text, show: true },
      // { keyName: 'nextVistDate', header: this.languageService.translate('nextVisit'), type: EType.date, show: true },
      // { keyName: 'visitNumber', header: this.languageService.translate('visitNumber'), type: EType.text, show: true },
      { keyName: 'specialOrderName', header: this.languageService.translate('special_order.form.specialOrderEnum'), type: EType.text, show: true },
      { keyName: 'specialOrderStatus', header: this.languageService.translate('order.form.order_status'), type: EType.specialOrderStatus, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'specialOrderId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'amount', header: this.languageService.translate('special_order.form.amount'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'clientId', header: this.languageService.translate('special_order.form.clientId'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'specialOrderStatus', header: this.languageService.translate('special_order.form.specialOrderStatusEnum'), type: EType.specialOrderStatus, showAs: ETableShow.content },
    ];
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

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  API_getAll() {
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        debugger;
        this.dataList = res.data.dataList;

        this.totalCount = res.data.totalCount;
        this.dataList.forEach((data: any) => {
          // Find the matching status object using the orderStatusEnum property
          const statusObj = this.statuses.find((status: any) => status.id === data.specialOrderStatus);
          if (statusObj) {
            // Create two new properties with Arabic and English values
            data.orderStatusAr = statusObj.nameAr;
            data.orderStatusEn = statusObj.nameEn;
          }
        });
        console.log(this.dataList);

        this.filteredData = [...this.dataList];
      }

    })
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

  onSelectedValue(selectedItem:any,value:string){
    if(value=='country')
      this.objectSearch.countryId=selectedItem
    if(value=='specialOrderStatusEnum')
      this.objectSearch.specialOrderStatusEnum=selectedItem
    else  if(value=='specialOrderEnum')
      this.objectSearch.specialOrderEnum=selectedItem
    else if(value=='clinet')
    this.objectSearch.clientId=selectedItem
  else if(value=='specialOrderId')
    this.objectSearch.specialOrderId=selectedItem

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
   
   // Re-apply saved filter value after list is loaded
   if (this.objectSearch.clientId) {
     this.clientControl.setValue(this.objectSearch.clientId);
   }
  })
 }
  onSubmitFilter() {
    debugger;
    let countryId:any =Number(this.objectSearch.countryId)
    this.objectSearch.countryId=countryId
    let specialOrderId:any =Number(this.objectSearch.specialOrderId)
    this.objectSearch.specialOrderId=specialOrderId

    this.saveFilterToStorage(); // Save filter when applying
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      pageNumber: 0,
      pageSize: 8,
      sortingExpression: "",
      countryId: null,
      sortingDirection: 0,
      specialOrderId: null,
      // amount: '',
      // media: "",
      clientId: null,
      specialOrderEnum: null,
      specialOrderStatusEnum:null
    }
    
    // Reset FormControls
    this.countryControl.setValue(null);
    this.clientControl.setValue(null);
    this.specialOrderEnumControl.setValue(null);
    this.specialOrderStatusControl.setValue(null);
    
    localStorage.removeItem(this.FILTER_STORAGE_KEY); // Clear saved filter
    this.API_getAll();
    this.showFilter = false
  }


}

