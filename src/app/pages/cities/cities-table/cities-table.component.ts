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
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';

@Component({
  selector: 'app-cities-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './cities-table.component.html',
  styleUrl: './cities-table.component.scss'
})
export class CitiesTableComponent {
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'City/Delete?requestId',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: 'city/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: 'city/edit',
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
        label: 'Cities',
      },
    ]
  }

  showFilter: boolean = false

  searchValue: any = '';
  filteredData: any;
  citiesList: any = []
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = []
  totalCount: number = 0;
   citySearch={
    pageNumber: 0,
    pageSize: 7,
    sortingExpression: "",
    sortingDirection: 0,
    enName: "",
    arName: "",
    postalCode: ""
  }
  selectedLang: any;
  languageService = inject(LanguageService);
  ngOnInit() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.getAllCities();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
    })
  }

  displayTableCols(currentLang:string){
    this.columns = [
      { keyName: 'cityId', header: 'Id', type: EType.id, show: true },
      { keyName:  currentLang =='ar'?'arName':'enName', header: 'Name', type: EType.text, show: true },
      { keyName: 'postalCode', header: 'Postal Code', type: EType.text, show: true },
      { keyName: 'latitude', header: 'latitude', type: EType.text, show: true },
      { keyName: 'longitude', header: 'longitude', type: EType.text, show: true },
      { keyName: 'shortCut', header: 'Short Name', type: EType.text, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable =[
      { keyName: currentLang =='ar'?'arName':'enName', header: 'Name', type: EType.text, showAs: ETableShow.header },
      { keyName: 'cityId', header: 'Id', type: EType.id, show: false },
      { keyName: 'postalCode', header: 'postalCode', type: EType.text, showAs: ETableShow.content },
      { keyName: 'latitude', header: 'latitude', type: EType.text, showAs: ETableShow.content },
      { keyName: 'longitude', header: 'longitude', type: EType.text, showAs: ETableShow.content },
      { keyName: 'shortCut', header: 'Short Name', type: EType.text, showAs: ETableShow.content }
    ];
  }

  getAllCities() {
  console.log('ggg',this.citySearch)
    this.ApiService.post('City/GetAll',this.citySearch).subscribe((res: any) => {
      if (res.data) {
        this.citiesList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.citiesList]; // Initialize filtered data
      }
    })
  }

  onPageChange(event: any) {
    console.log(event);
    this.citySearch.pageNumber = event;
    this.getAllCities();
  }

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }
}
