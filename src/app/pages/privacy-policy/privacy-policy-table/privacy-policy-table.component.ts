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
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName='privacy.pageName';
const global_router_add_url_in_Table ='/settings/privacy_policy/add';
const global_router_view_url ='/settings/privacy_policy/view';
const global_router_edit_url ='/settings/privacy_policy/edit';
const global_API_getAll ="PrivacyPolicy"+'/GetAllWithPagination';
const global_API_delete="PrivacyPolicy"+'/Delete?requestId';


@Component({
  selector: 'app-privacy-policy-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe, PaginationComponent, FormsModule, TranslatePipe, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './privacy-policy-table.component.html',
  styleUrl: './privacy-policy-table.component.scss'
})
export class PrivacyPolicyTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table;
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
    crumbs: []
  }

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
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
    this.pageName.set(global_pageName)
    this.API_getAll();
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getBreadCrumb();

    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'policyId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'enTitle', header: this.languageService.translate('privacy.form.title_en'), type: EType.text, show: true },
      { keyName: 'arTitle', header: this.languageService.translate('privacy.form.title_ar'), type: EType.text, show: true },
      { keyName: 'enDescription', header: this.languageService.translate('privacy.form.desc_en'), type: EType.editor, show: true },
      { keyName: 'arDescription', header: this.languageService.translate('privacy.form.desc_ar'), type: EType.editor, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'policyId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'enTitle', header: this.languageService.translate('privacy.form.title_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'arTitle', header: this.languageService.translate('privacy.form.title_ar'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'enDescription', header: this.languageService.translate('privacy.form.desc_en'), type: EType.editor, showAs: ETableShow.content },
      { keyName: 'arDescription', header: this.languageService.translate('privacy.form.desc_ar'), type: EType.editor, showAs: ETableShow.content }
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


