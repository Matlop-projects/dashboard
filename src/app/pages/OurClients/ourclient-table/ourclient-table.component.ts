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
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { OurClientService } from '../ourclient.service';

const global_pageName='ourclients.pageName'
const global_router_add_url_in_Table ='/settings/'+"ourclient"+'/add'
const global_router_view_url ='/settings/'+"ourclient"+'/view'
const global_router_edit_url ='/settings/'+"ourclient"+'/edit'
const global_API_getAll ="OurClients"+'/GetAllWithPagination'
const global_API_delete="OurClients"+'/DeleteOurClient?id'
@Component({
  selector: 'app-ourclient-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe, PaginationComponent,TranslatePipe, FormsModule, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './ourclient-table.component.html',
  styleUrl: './ourclient-table.component.scss'
})

export class OurClientTableComponent {
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
  private ourClientService = inject(OurClientService)

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    enName: "",
    arName: ""
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
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.getBreadCrumb()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getBreadCrumb()

    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'clientId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'enName', header: this.languageService.translate('ourclients.form.en_name'), type: EType.text, show: true },
      { keyName: 'arName', header: this.languageService.translate('ourclients.form.ar_name'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },
    ]
    this.columnsSmallTable = [
      { keyName: 'clientId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'enName', header: this.languageService.translate('ourclients.form.en_name'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'arName', header: this.languageService.translate('ourclients.form.ar_name'), type: EType.text, show: true },
      { keyName: 'imageAr', header: this.languageService.translate('ourclients.form.image_ar'), type: EType.image, showAs: ETableShow.content },
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
    this.ourClientService.getAllOurClients(this.objectSearch).subscribe((res: any) => {
      if (res && res.data) {
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
      item.enName.toLowerCase().includes(search) ||
      item.arName.toLowerCase().includes(search)
    );
  }
  onSubmitFilter() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      pageNumber: 0,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      enName: "",
      arName: ""
    }
    this.API_getAll();
    this.showFilter = false
  }
}


