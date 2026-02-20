import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import {
  EAction,
  EType,
  IcolHeader,
  ITableAction,
  TableComponent,
} from '../../components/table/table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { DrawerComponent } from '../../components/drawer/drawer.component';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import {
  ETableShow,
  IcolHeaderSmallTable,
  TableSmallScreenComponent,
} from '../../components/table-small-screen/table-small-screen.component';
import { ApiService } from '../../services/api.service';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { DialogModule } from 'primeng/dialog';
import { API } from '../../core/api-endpoints';
@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    TableComponent,
    TitleCasePipe,
    PaginationComponent,
    FormsModule,
    DrawerComponent,
    BreadcrumpComponent,
    RouterModule,
    TableSmallScreenComponent,
    TranslatePipe,
    DialogModule,
    ReactiveFormsModule,
    DialogComponent,
  ],

  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  //  global_router_add_url_in_Table =global_router_add_url_in_Table
  pageName = signal<string>('reviews.pageName');
  showRejectDialog = false;
  recordItem: any = {};
  router = inject(Router);
  showConfirmMessage = false;
  transactionId: number = 0;
  form = new FormGroup({
    reason: new FormControl('', Validators.required),
  });
  showFilter: boolean = false;
  tableActions: ITableAction[] = [
    // {
    //   name: EAction.view,
    //   apiName_or_route: '',
    //   autoCall: false,
    // },
    {
      name: EAction.delete,
      apiName_or_route: '',
      autoCall: false,
    },
  ];
  private ApiService = inject(ApiService);

  bredCrumb: IBreadcrumb = {
    crumbs: [],
  };

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: '',
    sortingDirection: 0,
    status: null,
    // enName: '',
    // arName: '',
  };

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = [];
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = [];

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set('reviews.pageName');
    this.API_getAll();
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang);
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang);
      this.getBreadCrumb();
    });
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      {
        keyName: 'serviceReviewId',
        header: this.languageService.translate('Id'),
        type: EType.editor,
        show: true,
      },
      {
        keyName: 'userName',
        header: this.languageService.translate('reviews.form.userName'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'orderId',
        header: this.languageService.translate('reviews.form.orderId'),
        type: EType.id,
        show: true,
      },
      {
        keyName: 'creationTime',
        header: this.languageService.translate('reviews.form.creationTime'),
        type: EType.date,
        show: true,
      },
      {
        keyName: 'review',
        header: this.languageService.translate('reviews.form.review'),
        type: EType.review,
        show: true,
      },
      {
        keyName: '',
        header: this.languageService.translate('Action'),
        type: EType.actions,
        actions: this.tableActions,
        show: true,
      },
    ];
    this.columnsSmallTable = [
      {
        keyName: 'serviceReviewId',
        header: 'Id',
        type: EType.id,
        show: true,
      },
      {
        keyName: 'userName',
        header: this.languageService.translate('reviews.form.userName'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'orderId',
        header: this.languageService.translate('reviews.form.orderId'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'creationTime',
        header: this.languageService.translate('reviews.form.creationTime'),
        type: EType.date,
        showAs: ETableShow.content,
      },
      {
        keyName: 'review',
        header: this.languageService.translate('reviews.form.review'),
        type: EType.review,
        show: true,
      },
    ];
  }

  openFilter() {
    this.showFilter = true;
  }
  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName()),
        },
      ],
    };
  }
  onCloseFilter(event: any) {
    this.showFilter = false;
  }

  callDeleteApi(record: any) {
    this.ApiService.delete(API.SERVICE_REVIEWS.BASE, record.serviceReviewId.toString()).subscribe((res) => {
      this.API_getAll();
    });
  }
  API_getAll() {
    this.ApiService.get(API.SERVICE_REVIEWS.SEARCH, this.objectSearch).subscribe(
      (res: any) => {
        if (res) {
          this.dataList = res.data.dataList;
          this.totalCount = res.data.totalCount;
          this.filteredData = [...this.dataList];
        }
      }
    );
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

    this.dataList = this.dataList.filter(
      (item: any) =>
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
      sortingExpression: '',
      sortingDirection: 0,
      status: null,
      // enName: '',
      // arName: '',
    };
    this.API_getAll();
    this.showFilter = false;
  }

  onActionCliked(event: any) {
    this.recordItem = event.record;

    if (event.action.name == 'delete') {
      this.showConfirmMessage = true;
      // this.onConfirmMessage(event.record)
    } else {
      this.router.navigate([
        '/reviewDetails',
         { userId: this.recordItem.userId, orderId: this.recordItem.orderId }

      ]);
    }
  }
  onConfirmMessage() {
    this.showConfirmMessage = false;
    this.callDeleteApi(this.recordItem);
  }
  // onApproveAPI() {
  //   let payload = {
  //     transactionId: this.transactionId,
  //     rejectionReason: '',
  //   };
  //   this.ApiService.post(
  //     'RefundedWallet/ApprovedWalletTransaction',
  //     payload,
  //      {
  //     showAlert: true,
  //     message:this.selectedLang=='en'? `Approved Transaction Successfuly`:'تم قبول العملية بنجاح'
  //      }
  //   ).subscribe((res) => {
  //     console.log("🚀 ~ WithdrawalsTransactionComponent ~ onApproveAPI ~ res:", res)

  //   });
  // }
}
