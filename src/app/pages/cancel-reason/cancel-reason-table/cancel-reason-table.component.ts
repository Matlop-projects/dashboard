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


@Component({
  selector: 'app-cancel-reason-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent,TitleCasePipe, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './cancel-reason-table.component.html',
  styleUrl: './cancel-reason-table.component.scss'
})
export class CancelReasonTableComponent {
  pageName =signal<string>('');

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'Cancelreason/DeleteCancelReason?id',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: 'cancel-reason/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: 'cancel-reason/edit',
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
        label: 'Cancel Reason',
      },
    ]
  }

  objectSearch = {
    pageNumber: 0,
    pageSize: 7,
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
    this.pageName.set('Cancel Reason')
    this.getAllCancelReason();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'reasonId', header: 'Id', type: EType.id, show: true },
      { keyName: 'enName', header: 'Reason (en)', type: EType.text, show: true },
      { keyName: 'arName', header: 'Reason (ar)', type: EType.text, show: true },
      { keyName: 'enDescription', header: 'Description (en)', type: EType.editor, show: true },
      { keyName: 'arDescription', header: 'Description (Ar)', type: EType.editor, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: currentLang == 'ar' ? 'arName' : 'enName', header: 'Reason (ar)', type: EType.text, showAs: ETableShow.header },
      { keyName: 'reasonId', header: 'Id', type: EType.id, show: false },
      { keyName: currentLang == 'ar' ? 'arDescription' : 'enDescription', header: 'Reason (ar)', type: EType.editor, showAs: ETableShow.content }
    ];
  }

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  getAllCancelReason() {
    this.ApiService.post('CancelReason/GetAllCancelReason', this.objectSearch).subscribe((res: any) => {
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
    this.getAllCancelReason();
  }

  filterData() {
    this.dataList = this.filteredData;
    const search = this.searchValue.toLowerCase();
    console.log(search);
    console.log(this.searchValue.length);


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
    this.getAllCancelReason();
  }

  reset() {
    this.objectSearch = {
      pageNumber: 0,
      pageSize: 7,
      sortingExpression: "",
      sortingDirection: 0,
      enName: "",
      arName: ""
    }
    this.getAllCancelReason();
    this.showFilter = false
  }

}
