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
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName='equipments.pageName'
const global_router_add_url_in_Table ='/'+'equipment'+'/add'
const global_router_view_url ='equipment'+'/view'
const global_router_edit_url ='equipment'+'/edit'
const global_API_getAll ='equipment'+'/GetAllWithPagination'
const global_API_delete='equipment'+'/Delete?id'

@Component({
  selector: 'app-equipments-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe,SelectComponent, TranslatePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './equipments-table.component.html',
  styleUrl: './equipments-table.component.scss'
})
export class EquipmentsTableComponent {
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
    ]
  }

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
   "enName": "",
  "arName": "",
  "packageId":0,
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
    this.displayTableCols(this.selectedLang);
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang);
      this.getBreadCrumb();
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'equipmentId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'image', header: this.languageService.translate('equipments.form.image'), type: EType.image, show: true },
      { keyName: currentLang === 'ar' ? 'arName' : 'enName', header: this.languageService.translate('equipments.form.nameEn'), type: EType.text, show: true },
      // { keyName: 'packageName', header: this.languageService.translate('equipments.form.pkg'), type: EType.text, show: true },
      { keyName: 'price', header: this.languageService.translate('pkg.form.price'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'equipmentId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: currentLang === 'ar' ? 'arName' : 'enName', header: this.languageService.translate('equipments.form.nameEn'), type: EType.text, showAs: ETableShow.header },
      // { keyName: 'packageName', header: this.languageService.translate('equipments.form.pkg'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'price', header: this.languageService.translate('pkg.form.price'), type: EType.text, showAs: ETableShow.content },
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
    // this.ApiService.get(global_API_getAll).subscribe((res: any) => {
    //   if (res) {
    //     this.dataList = res.data;
    //     this.totalCount = res.data.totalCount;
    //     this.filteredData = [...this.dataList];
    //   }

    // })
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
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      "enName": "",
      "arName": "",
      "packageId": 0,
    }
    this.API_getAll();
    this.showFilter = false
  }
}

