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
import { TitleCasePipe } from '@angular/common';


const global_pageName='Role';
const global_router_add_url_in_Table ='/settings/role/add';
const global_router_view_url ='/settings/role/view';
const global_router_edit_url ='/settings/role/edit';
const global_API_getAll =global_pageName+'/GetAll';
const global_API_delete=global_pageName+'/GetById?requestId';

@Component({
  selector: 'app-role-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe , FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './role-table.component.html',
  styleUrl: './role-table.component.scss'
})
export class RoleTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName =signal<string>('Roles');

  showFilter: boolean = false
  tableActions: ITableAction[] = [

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


  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set('Role')
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
      { keyName: 'roleId', header: 'Id', type: EType.id, show: true },
      { keyName: 'enName', header: 'Role En', type: EType.text, show: true },
      { keyName: 'arName', header: 'Role Ar', type: EType.text, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'roleId', header: 'Id', type: EType.id, show: false },
      { keyName: 'enName', header: 'Role En', type: EType.text, showAs: ETableShow.header },
      { keyName: 'arName', header: 'Role Ar', type: EType.text, showAs: ETableShow.header }
    ];
  }

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  API_getAll() {
    this.ApiService.get(global_API_getAll).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data;
        this.filteredData = [...this.dataList];
      }

    })
  }

}




