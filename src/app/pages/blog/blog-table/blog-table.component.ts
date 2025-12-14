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
import { coponeOfferTypeList, coponeTypeList } from '../../../conts';
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName='blog.pageName'
const global_router_add_url_in_Table ='/settings/'+"blog"+'/add'
const global_router_view_url ='/settings/'+"blog"+'/view'
const global_router_edit_url ='/settings/'+"blog"+'/edit'
const global_API_getAll ="blog"+'/GetAllBlog'
const global_API_delete="blog"+'/DeleteBlog?id'
@Component({
  selector: 'app-blog-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe, PaginationComponent,TranslatePipe, FormsModule, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './blog-table.component.html',
  styleUrl: './blog-table.component.scss'
})

export class BlogTableComponent {
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
    crumbs: []
  }

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    arName: "",
    enName: "",
    serivceId: null,
    countryId: null

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
    this.getBreadCrumb()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getBreadCrumb()

    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'blogId', header:  this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'enName', header:  this.languageService.translate('slider.form.title_en'), type: EType.text, show: true },
      { keyName: 'arName', header:  this.languageService.translate('slider.form.title_ar'), type: EType.text, show: true },
      { keyName: 'orderNo', header: this.languageService.translate('slider.form.displayOrder'), type: EType.text, show: true },
      { keyName: '', header:  this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
     { keyName: 'blogId', header:  this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'enName', header:  this.languageService.translate('slider.form.title_en'), type: EType.text, show: true },
      { keyName: 'arName', header:  this.languageService.translate('slider.form.title_ar'), type: EType.text, show: true },
      { keyName: 'orderNo', header: this.languageService.translate('slider.form.displayOrder'), type: EType.text, show: true },
      { keyName: '', header:  this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },


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
    this.ApiService.post('blog/GetAllBlog',this.objectSearch).subscribe((res: any) => {
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
    arName: "",
    enName: "",
    serivceId: null,
    countryId: null
    }
    this.API_getAll();
    this.showFilter = false
  }
}


