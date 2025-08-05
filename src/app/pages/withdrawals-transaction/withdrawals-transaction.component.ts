import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
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

const global_pageName = 'withdrawals_transaction.pageName';
// const global_router_add_url_in_Table = '/' + global_API_Name + '/add';
// const global_router_view_url = global_API_Name + '/view';
// const global_router_edit_url = global_API_Name + '/edit';
const global_API_getAll =
  'RefundedWallet/GetAllWithDrawTransactionWithPagination';
// const global_API_delete = global_API_Name + '/DeletepaymentWay?id';
@Component({
  selector: 'app-withdrawals-transaction',
  standalone: true,
  imports: [
    TableComponent,
    TitleCasePipe,
    PaginationComponent,
    FormsModule,
    DrawerComponent,
    BreadcrumpComponent,
    RouterModule,
    InputTextModule,
    TableSmallScreenComponent,
    TranslatePipe,
    DialogModule,
    InputTextComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './withdrawals-transaction.component.html',
  styleUrl: './withdrawals-transaction.component.scss',
})
export class WithdrawalsTransactionComponent {
  //  global_router_add_url_in_Table =global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);
  showRejectDialog = false;
  transactionId:number=0
  form = new FormGroup({
    reason: new FormControl('', Validators.required),
  });
  showFilter: boolean = false;
  tableActions: ITableAction[] = [
    {
      name: EAction.approve,
      apiName_or_route: '',
      autoCall: false,
    },
    {
      name: EAction.reject,
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
    status:null
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
    this.pageName.set(global_pageName);
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
        keyName: 'walletTransactionId',
        header: this.languageService.translate('Id'),
        type: EType.editor,
        show: true,
      },
      {
        keyName: 'userName',
        header: this.languageService.translate(
          'withdrawals_transaction.form.userName'
        ),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'userId',
        header: this.languageService.translate(
          'withdrawals_transaction.form.userId'
        ),
        type: EType.id,
        show: true,
      },
      {
        keyName: 'amount',
        header: this.languageService.translate(
          'withdrawals_transaction.form.amount'
        ),
        type: EType.text,
        show: true,
      },
      {
         keyName: 'status',
        header: this.languageService.translate(
          'withdrawals_transaction.form.status'
        ),
        type: EType.text,
        show: true
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
        keyName: 'walletTransactionId',
        header: 'Id',
        type: EType.id,
        show: true,
      },
      {
        keyName: 'userName',
        header: this.languageService.translate(
          'withdrawals_transaction.form.userName'
        ),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'userId',
        header: this.languageService.translate(
          'withdrawals_transaction.form.userId'
        ),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'amount',
        header: this.languageService.translate(
          'withdrawals_transaction.form.amount'
        ),
        type: EType.text,
        showAs: ETableShow.content,
      },
       {
        keyName: 'status',
        header: this.languageService.translate(
          'withdrawals_transaction.form.status'
        ),
        type: EType.text,
        show: true
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

  API_getAll() {
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe(
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
    console.log(event);
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
      status:null
      // enName: '',
      // arName: '',
    };
    this.API_getAll();
    this.showFilter = false;
  }

  onActionCliked(event: any) {
    console.log('ggg', event);
    this.transactionId=event.record.walletTransactionId
    console.log("🚀 ~ WithdrawalsTransactionComponent ~ onActionCliked ~  this.transactionId:",  this.transactionId)
    if (event.action.name == 'approve') this.onRejectOrAcceoptAPI(1);
    else this.showRejectDialog = true;
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

  onRejectOrAcceoptAPI(type:number) {
    // let message=''
    // if(type==1)
    //     message=this.selectedLang=='en'? `Approved Transaction Successfuly`:'تم قبول العملية بنجاح'
    //  else
    //   message= this.selectedLang=='en'?`Reject Transaction Successfuly`:'تم رفض العملية بنجاح'

    let payload = {
      transactionId:this.transactionId,
      rejectionReason: this.form.value.reason,
      isApproved: type,

    };
    this.ApiService.post(
      'RefundedWallet/ApprovedOrRejectedWalletTransaction',
      payload,
       {
      showAlert: true,
      message:''
       }
    ).subscribe((res) => {
      console.log("🚀 ~ WithdrawalsTransactionComponent ~ onRejectAPI ~ res:", res)
      if(res){
this.showRejectDialog=false;
this.API_getAll()
      }
            

    });
  }

  onSubmit() {
    this.onRejectOrAcceoptAPI(2)
  }
}
