import { Component, inject } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';


@Component({
  selector: 'app-working-hours-table',
  standalone: true,
  imports: [TableComponent, FormsModule, PaginationComponent, BreadcrumpComponent, DrawerComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './working-hours-table.component.html',
  styleUrl: './working-hours-table.component.scss'
})
export class WorkingHoursTableComponent {

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'WorkingTime/DeleteWorkingTime?id',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: 'working_hours/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: 'working_hours/edit',
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService)
  private router = inject(Router)


  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Working Hours',
      },
    ]
  }

  searchObject = {
      "pageNumber": 0,
      "pageSize": 8,
      "sortingExpression": "",
      "sortingDirection": 0,
      "startDate": null,
      "endDate": null
  }

  searchValue: any = '';
  filteredData: any;
  workingHoursList: any = []
  columns: IcolHeader[] = [
    { keyName: 'workTimeId', header: 'Id', type: EType.id, show: true },
    { keyName: 'startDate', header: 'Start Time', type: EType.time, show: true },
    { keyName: 'endDate', header: 'End Time', type: EType.time, show: true },
    { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },
  ];

  columnsSmallTable: IcolHeaderSmallTable[] = [];
  totalCount: number = 0;

  selectedLang: any;
  languageService = inject(LanguageService);
  ngOnInit() {
    this.getAllFAQS();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displaySmallTableCols(this.selectedLang)
    })
    // this.data=products
    // this.paginatorOptions.totalRecords=this.data.length
  }

  displaySmallTableCols(currentLang:string){
    this.columnsSmallTable =[
      { keyName: 'startDate', header: 'Start Time', type: EType.time, showAs: ETableShow.header },
      { keyName: 'workTimeId', header: 'Id', type: EType.id, show: false },
      { keyName: 'endDate', header: 'End Time', type: EType.time, showAs: ETableShow.content }
    ];
  }
  getAllFAQS() {
    this.ApiService.post('WorkingTime/GetAllWithPagination' , this.searchObject).subscribe((res: any) => {
      if (res) {
        this.workingHoursList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.workingHoursList]; // Initialize filtered data
      }

    })
  }

  onPageChange(event: any) {
    this.searchObject.pageNumber = event;
   this,this.getAllFAQS();
  }


  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

}
