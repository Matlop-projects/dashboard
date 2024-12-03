import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NgFor, TitleCasePipe } from '@angular/common';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { ApiService } from '../../../services/api.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { LanguageService } from '../../../services/language.service';

const global_pageName = 'Client';
const global_API_Name = 'Client';
const global_router_add_url_in_Table = '/client/add';
const global_router_view_url = '/client/view';
const global_router_edit_url = '/client/edit';
const global_API_getAll = global_API_Name + '/GetAllWithPagination';
const global_API_Active = global_API_Name + '/Activate?userId';
const global_API_block = global_API_Name + '/Delete?userId';

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [
    TableComponent,
    TitleCasePipe,
    PaginationComponent,
    FormsModule,
    DrawerComponent,
    BreadcrumpComponent,
    RouterModule,
    InputTextModule,
    TableSmallScreenComponent,
    NgFor
  ],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss'
})
export class ClientTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.view,
      apiName_or_route: global_router_view_url,
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: global_router_edit_url,
      autoCall: true
    },
    {
      name: EAction.active,
      apiName_or_route: global_API_Active,
      autoCall: true
    },
    {
      name: EAction.block,
      apiName_or_route: global_API_block,
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
    "pageNumber": 0,
    "pageSize": 8,
    "sortingExpression": "",
    "sortingDirection": 0,
    "isActive": null,
    "fullName": "",
    "userName": "",
    "email": ""
  }

  clientStatuslist = [
    { id: null, name: 'All' },
    { id: true, name: 'Active' },
    { id: false, name: 'Deactive' },
  ];

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
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'userId', header: 'Id', type: EType.id, show: true },
      { keyName: 'fullName', header: 'Name', type: EType.text, show: true },
      { keyName: 'userName', header: 'Username', type: EType.text, show: true },
      { keyName: 'email', header: 'Email', type: EType.text, show: true },
      { keyName: 'isActive', header: 'Active', type: EType.boolean, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'fullName', header: 'Name', type: EType.text, showAs: ETableShow.header },
      { keyName: 'userId', header: 'Id', type: EType.id, show: false },
      { keyName: currentLang == 'ar' ? 'arDescription' : 'enDescription', header: 'Name (ar)', type: EType.editor, showAs: ETableShow.content }
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

  onSubmitFilter() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      "pageNumber": 0,
      "pageSize": 8,
      "sortingExpression": "",
      "sortingDirection": 0,
      "isActive": null,
      "fullName": "",
      "userName": "",
      "email": ""
    }
    this.API_getAll();
    this.showFilter = false
  }

  reloadGetAllApi(e: any) {
    if (e) {
      this.API_getAll();
    }
  }

}



