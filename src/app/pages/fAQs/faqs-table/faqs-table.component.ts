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
  selector: 'app-faqs',
  standalone: true,
  imports: [TableComponent, PaginatorComponent, FormsModule, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './faqs-table.component.html',
  styleUrl: './faqs-table.component.scss'
})
export class FaqsTableComponent {
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
        label: 'FAQs',
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
    this.getAllFAQS();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
    })
  }

  displayTableCols(currentLang:string){
    this.columns=[
      { keyName: 'questionId', header: 'Id', type: EType.id, show: true },
      { keyName: 'enTitle', header: 'Question (en)', type: EType.text, show: true },
      { keyName: 'arTitle', header: 'Question (ar)', type: EType.text, show: true },
      { keyName: 'enDescription', header: 'Answer (en)', type: EType.editor, show: true },
      { keyName: 'arDescription', header: 'Answer (Ar)', type: EType.editor, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },
    
    ]
    this.columnsSmallTable =[
      { keyName: currentLang =='ar'?'arTitle':'enTitle', header: 'Question (ar)', type: EType.text, showAs: ETableShow.header },
      { keyName: 'questionId', header: 'Id', type: EType.id, show: false },
      { keyName: currentLang =='ar'?'arDescription':'enDescription', header: 'Question (ar)', type: EType.editor, showAs: ETableShow.content }
    ];
  }
  getAllFAQS() {
    this.ApiService.get('FAQs/GetAll').subscribe((res: any) => {
      if (res) {
        this.faqsList = res.data;
        this.filteredData = [...this.faqsList]; // Initialize filtered data
        this.paginatorOptions.totalRecords = res.data.length;
        console.log('FAQs loaded:', this.faqsList);
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
