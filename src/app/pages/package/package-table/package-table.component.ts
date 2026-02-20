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
import { API } from '../../../core/api-endpoints';

@Component({
  selector: 'app-package-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe,SelectComponent, TranslatePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './package-table.component.html',
  styleUrl: './package-table.component.scss'
})
export class PackageTableComponent {
  global_router_add_url_in_Table = '/package/add'
  pageName =signal<string>('package');

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: API.PACKAGES.BASE,
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: 'package/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: 'package/edit',
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
    enName:'',
    arName:''
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
    this.pageName.set('package')
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
      { keyName: 'packageId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: currentLang === 'ar' ? 'nameAr' : 'nameEn', header: this.languageService.translate('pkg.form.nameEn'), type: EType.text, show: true },
      { keyName: currentLang === 'ar' ? 'descriptionAr' : 'descriptionEn', header: this.languageService.translate('pkg.form.desc_en'), type: EType.editor, show: true },
      { keyName: 'providerNumber', header: this.languageService.translate('pkg.form.provider_no'), type: EType.text, show: true },
      // { keyName: 'typeOfPackage', header: this.languageService.translate('pkg.form.type_pkg'), type: EType.text, show: true },
      { keyName: 'visitNumber', header: this.languageService.translate('pkg.form.visit_no'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'packageId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: currentLang === 'ar' ? 'nameAr' : 'nameEn', header: this.languageService.translate('pkg.form.nameEn'), type: EType.text, showAs: ETableShow.header },
      { keyName: currentLang === 'ar' ? 'descriptionAr' : 'descriptionEn', header: this.languageService.translate('pkg.form.desc_en'), type: EType.editor, showAs: ETableShow.header },
      { keyName: 'providerNumber', header: this.languageService.translate('pkg.form.provider_no'), type: EType.text, showAs: ETableShow.content },
      // { keyName: 'typeOfPackage', header: this.languageService.translate('pkg.form.type_pkg'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'visitNumber', header: this.languageService.translate('pkg.form.visit_no'), type: EType.text, showAs: ETableShow.content },
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
          label: this.languageService.translate('pkg.pageName'),
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
    this.ApiService.get(API.PACKAGES.SEARCH, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.dataList];
      }

    })
    // this.ApiService.get(global_API_getAll).subscribe((res: any) => {
    //   if (res) {
    //     this.dataList = res.data;
    //     // this.totalCount = res.data.totalCount;p
    //     // this.filteredData = [...this.dataList];
    //   }

    // })
  }

  onPageChange(event: any) {
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
      enName:'',
      arName:''
    }
    this.API_getAll();
    this.showFilter = false
  }
}

