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

const global_pageName='PrivacyPolicy';
const global_router_add_url_in_Table ='/settings/privacy_policy/add';
const global_router_view_url ='/settings/privacy_policy/view';
const global_router_edit_url ='/settings/privacy_policy/edit';
const global_API_getAll =global_pageName+'/GetAll';
const global_API_delete=global_pageName+'/Delete?requestId';


@Component({
  selector: 'app-privacy-policy-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './privacy-policy-table.component.html',
  styleUrl: './privacy-policy-table.component.scss'
})
export class PrivacyPolicyTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName =signal<string>('Privacy and Policy');

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
    name: "",
    email: "",
    phoneNumber: ""

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
    this.pageName.set('Privacy and Policy')
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
      { keyName: 'policyId', header: 'Id', type: EType.id, show: true },
      { keyName: 'enTitle', header: 'Title En', type: EType.text, show: true },
      { keyName: 'arTitle', header: 'Title Ar', type: EType.text, show: true },
      { keyName: 'enDescription', header: 'Description En', type: EType.editor, show: true },
      { keyName: 'arDescription', header: 'Description Ar', type: EType.editor, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'policyId', header: 'Id', type: EType.id, show: false },
      { keyName: 'enTitle', header: 'Title En', type: EType.text, showAs: ETableShow.header },
      { keyName: 'arTitle', header: 'Title Ar', type: EType.text, showAs: ETableShow.header },
      { keyName: 'enDescription', header: 'Description En', type: EType.editor, showAs: ETableShow.content },
      { keyName: 'arDescription', header: 'Description Ar', type: EType.editor, showAs: ETableShow.content }
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

}


