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


@Component({
  selector: 'app-working-hours-table',
  standalone: true,
  imports: [TableComponent, FormsModule, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './working-hours-table.component.html',
  styleUrl: './working-hours-table.component.scss'
})
export class WorkingHoursTableComponent {
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

  searchValue: any = '';
  filteredData: any;
  workingHoursList: any = []
  columns: IcolHeader[] = [
    { keyName: 'workTimeId', header: 'Id', type: EType.id, show: true },
    { keyName: 'startDate', header: 'Start Time', type: EType.time, show: true },
    { keyName: 'endDate', header: 'End Time', type: EType.time, show: true },
    { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },
  ];

  columnsSmallTable: IcolHeaderSmallTable[] = []

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
    this.ApiService.get('WorkingTime/GetAllWorkingTime').subscribe((res: any) => {
      if (res) {
        this.workingHoursList = res.data;
        this.filteredData = [...this.workingHoursList]; // Initialize filtered data
      }

    })
  }

  onPageChange(event: any) {
    // console.log("DashboardComponent  onPageChange  this.paginatorValue:", this.paginatorValue)
    // this.datafilterd =this.paginateArray(this.data,event)
  }

  filterData() {
    this.workingHoursList = this.filteredData;
    const search = this.searchValue.toLowerCase();
    console.log(search);
    console.log(this.searchValue.length);


    if (this.searchValue.length == 1) {
      this.workingHoursList = this.filteredData;
      return;
    }

    this.workingHoursList = this.workingHoursList.filter((item: any) =>
      item.startDate.toLowerCase().includes(search) ||
      item.endDate.toLowerCase().includes(search)
    );
  }

}
