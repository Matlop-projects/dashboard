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
  selector: 'app-faqs',
  standalone: true,
  imports: [TableComponent, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './faqs-table.component.html',
  styleUrl: './faqs-table.component.scss'
})
export class FaqsTableComponent {

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'FAQs/Delete?requestId',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: '/settings/faqs/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: '/settings/faqs/edit',
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
        label: 'FAQs',
      },
    ]
  }

  faqSearchCreteria = {
    pageNumber: 0,
    pageSize: 7,
    sortingExpression: "",
    sortingDirection: 0,
    enTitle: "",
    arTitle: ""
  }

  totalCount: number = 0;

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

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'questionId', header: 'Id', type: EType.id, show: true },
      { keyName: 'enTitle', header: 'Question (en)', type: EType.text, show: true },
      { keyName: 'arTitle', header: 'Question (ar)', type: EType.text, show: true },
      { keyName: 'enDescription', header: 'Answer (en)', type: EType.editor, show: true },
      { keyName: 'arDescription', header: 'Answer (Ar)', type: EType.editor, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: currentLang == 'ar' ? 'arTitle' : 'enTitle', header: 'Question (ar)', type: EType.text, showAs: ETableShow.header },
      { keyName: 'questionId', header: 'Id', type: EType.id, show: false },
      { keyName: currentLang == 'ar' ? 'arDescription' : 'enDescription', header: 'Question (ar)', type: EType.editor, showAs: ETableShow.content }
    ];
  }

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  getAllFAQS() {
    this.ApiService.post('FAQs/GetAll', this.faqSearchCreteria).subscribe((res: any) => {
      if (res) {
        this.faqsList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.faqsList];
        console.log('FAQs loaded:', this.faqsList);
      }

    })
  }

  onPageChange(event: any) {
    console.log(event);
    this.faqSearchCreteria.pageNumber = event;
    this.getAllFAQS();
  }

  onSubmit() {
    console.log("Form Submitted:", this.faqSearchCreteria);
    this.getAllFAQS();
  }

  reset() {
    this.faqSearchCreteria = {
      pageNumber: 0,
      pageSize: 7,
      sortingExpression: "",
      sortingDirection: 0,
      enTitle: "",
      arTitle: ""
    }
    this.getAllFAQS();
    this.showFilter = false
  }
}
