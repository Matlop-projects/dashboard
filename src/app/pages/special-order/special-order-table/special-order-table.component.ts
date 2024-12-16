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

const global_pageName = 'Special Orders'
const global_router_add_url_in_Table = '/special-order/add'
const global_router_view_url = 'special-order/view'
const global_router_edit_url = 'special-order/edit'
const global_API_getAll = 'specialOrder/GetAllWitPagination'
const global_API_delete = 'specialOrder/Delete?id'

@Component({
  selector: 'app-special-order-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent, TitleCasePipe, TranslatePipe, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './special-order-table.component.html',
  styleUrl: './special-order-table.component.scss'
})
export class SpecialOrderTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: global_API_delete,
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: global_router_view_url,
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
    specialOrderId: 0,
    amount: 0,
    media: "",
    clientId: 0,
    specialOrderEnum: 1
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
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'specialOrderId', header: 'Id', type: EType.id, show: true },
      { keyName: 'media', header: 'image', type: EType.text, show: true },
      { keyName: 'amount', header: 'amount', type: EType.text, show: true },
      { keyName: 'clinetId', header: 'clinetId', type: EType.text, show: true },
      { keyName: 'notes', header: 'notes', type: EType.editor, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'specialOrderId', header: 'Id', type: EType.id, show: false },
      { keyName: 'media', header: 'image', type: EType.text, showAs: ETableShow.header },
      { keyName: 'amount', header: 'amount', type: EType.text, showAs: ETableShow.content },
      { keyName: 'clinetId', header: 'clinetId', type: EType.text, showAs: ETableShow.content },
      { keyName: 'notes', header: 'notes', type: EType.editor, show: true, showAs: ETableShow.content },

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
      specialOrderId: 0,
      amount: 0,
      media: "",
      clientId: 0,
      specialOrderEnum: 1
    }
    this.API_getAll();
    this.showFilter = false
  }
}

