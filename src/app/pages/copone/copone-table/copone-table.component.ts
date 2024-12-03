import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe } from '@angular/common';
import { SelectComponent } from '../../../components/select/select.component';
import { coponeOfferTypeList, coponeTypeList } from '../../../conts';

const global_pageName='copone'
const global_router_add_url_in_Table ='/'+global_pageName+'/add'
const global_router_view_url =global_pageName+'/view'
const global_router_edit_url =global_pageName+'/edit'
const global_API_getAll =global_pageName+'/GetAllWithPagination'
const global_API_delete=global_pageName+'/Delete?requestId'

@Component({
  selector: 'app-copone-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe,SelectComponent, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './copone-table.component.html',
  styleUrl: './copone-table.component.scss'
})
export class CoponeTableComponent {
  global_router_add_url_in_Table =global_router_add_url_in_Table
  pageName =signal<string>(global_pageName);

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: global_API_delete,
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route:  global_router_view_url,
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: global_router_edit_url, 
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService)


  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: this.pageName(),
      },
    ]
  }

  objectSearch = {
    pageNumber: 0,
    pageSize: 7,
    sortingExpression: "",
    sortingDirection: 0,
    code: "",
    offerType: 0,
    couponType: 0
  }

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];
  offerTypeList:any[]=coponeOfferTypeList
  coponeTypeList:any[]=coponeTypeList
  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_pageName) 
    this.API_getAll();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'coponeId', header: 'Id', type: EType.id, show: true },
      { keyName: 'code', header: 'Code', type: EType.text, show: true },
      { keyName: 'startDate', header: 'Start date', type: EType.date, show: true },
      { keyName: 'endDate', header: 'End Date', type: EType.date, show: true },
      { keyName: 'usedNumber', header: 'Used', type: EType.text, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'coponeId', header: 'Id', type: EType.id, show: false },
      { keyName: 'code', header: 'Code', type: EType.text, showAs: ETableShow.header },
      { keyName: 'startDate', header: 'Start', type: EType.date, showAs: ETableShow.content },
      { keyName: 'endDate', header: 'end', type: EType.date, showAs: ETableShow.content },
      { keyName: 'usedNumber', header: 'used', type: EType.text, show: true },

    ];
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
        this.dataList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.dataList];
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
  onSubmitFilter() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      pageNumber: 0,
      pageSize: 7,
      sortingExpression: "",
      sortingDirection: 0,
      code: "",
      offerType: 0,
      couponType: 0
    }
    this.API_getAll();
    this.showFilter = false
  }
}

