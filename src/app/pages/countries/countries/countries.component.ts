import { Component, inject } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { IPaginator, IPaignatotValue, PaginatorComponent } from '../../../components/paginator/paginator.component';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';


@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [TableComponent, PaginatorComponent, FormsModule, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent {
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'FAQs/Delete?requestId',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: 'faqs/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: 'faqs/edit',
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService)
  private router = inject(Router)
  paginatorOptions: IPaginator = {
    displayItem: 5,
    totalRecords: 0,
  }
  paginatorValue: IPaignatotValue = {
    first: 0,
    page: 1,
    pageCount: 0,
    rows: 0
  }

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Countries',
      },
    ]
  }

  searchValue: any = '';
  filteredData: any;
  faqsList: any = []
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);
  ngOnInit() {
    this.getAllCountries();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
    })
  }

  displayTableCols(currentLang:string){
    this.columns = [
      { keyName: 'countryId', header: 'Id', type: EType.id, show: false },
      { keyName: 'img', header: 'image', type: EType.image, show: true },
      { keyName:  currentLang =='ar'?'arName':'enName', header: 'Name', type: EType.text, show: true },
      { keyName: 'phoneLength', header: 'Phone Length', type: EType.text, show: true },
      { keyName: 'phoneCode', header: 'Phone Code', type: EType.text, show: true },
      { keyName: 'shortName', header: 'Short Name', type: EType.text, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable =[
      { keyName: currentLang =='ar'?'arName':'enName', header: 'Name', type: EType.text, showAs: ETableShow.header },
      { keyName: 'countryId', header: 'Id', type: EType.id, show: false },
      { keyName: currentLang =='ar'?'arDescription':'enDescription', header: 'Description', type: EType.text, showAs: ETableShow.content }
    ];
  }

  getAllCountries() {
    this.ApiService.get('Country/GetAllCountry').subscribe((res: any) => {
      if (res) {
        this.faqsList = res.data;
        this.filteredData = [...this.faqsList]; // Initialize filtered data
        this.paginatorOptions.totalRecords = res.data.length;
      }

    })
  }

  onPageChange(event: any) {
    this.paginatorValue = event
    // console.log("DashboardComponent  onPageChange  this.paginatorValue:", this.paginatorValue)
    // this.datafilterd =this.paginateArray(this.data,event)
  }

  filterData() {
    this.faqsList = this.filteredData;
    const search = this.searchValue.toLowerCase();
    console.log(search);
    console.log(this.searchValue.length);


    if (this.searchValue.length == 1) {
      this.faqsList = this.filteredData;
      return;
    }

    this.faqsList = this.faqsList.filter((item: any) =>
      item.enTitle.toLowerCase().includes(search) ||
      item.arTitle.toLowerCase().includes(search) ||
      item.enDescription.toLowerCase().includes(search) ||
      item.arDescription.toLowerCase().includes(search)
    );
  }
}
