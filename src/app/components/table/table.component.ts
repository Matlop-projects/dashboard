import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DialogComponent } from '../dialog/dialog.component';
import { CheckBoxComponent } from '../check-box/check-box.component';
import { environment } from '../../../environments/environment';

export interface IToggleOptions {
  autoCall: boolean,
  apiName: string
}

export enum EAction {
  delete = "delete",
  view = "view",
  edit = "edit",
  block = "block",
  active = "active"
}
export interface ITableAction {
  name: EAction,
  apiName_or_route: string,
  autoCall: boolean
}
export enum EType {
  id = "id",
  text = "text",
  image = "image",
  object = "object",
  date = "date",
  time = "time",
  status = "status",
  index = "index",
  actions = "actions",
  editor = 'editor',
  boolean = 'boolean',
  toggle = 'toggle',
  orderStatus = 'orderStatus',
  specialOrderStatus = 'specialOrderStatus'
}
interface INested {
  img: string,
  text: string
}
export interface IcolHeader {
  header: string,
  keyName: string,
  type: EType,
  nested?: INested,
  actions?: any[],
  show?: boolean,
  toggleOptions?: IToggleOptions
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, NgFor, NgIf, TooltipModule, DialogComponent, CheckBoxComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})

export class TableComponent implements OnInit, OnChanges {

  @Input() showrecordIndex = false;
  @Input({ required: true }) records: any = [];
  @Input() hasPaginator: boolean = true;
  filterdRecords: any = [];
  @Input({ required: true }) colsHeader: IcolHeader[] = [];
  @Input() actions: any[] = [];
  @Output() onActionCliked = new EventEmitter();
  @Output() onstatusChanged = new EventEmitter();

  @Output() reloadGetAllApi = new EventEmitter();
  showConfirmMessage: boolean = false;
  showBlockConfirmationMessage: boolean = false;
  showActiveConfirmationMessage: boolean = false;
  ApiService = inject(ApiService);
  router = inject(Router);
  eventEmitValue: any = { action: {}, record: {} }
  imageBaseUrl=environment.baseImageUrl
  ngOnInit() {
    this.filterdRecords = this.records;
  }

  ngOnChanges() {
    this.filterdRecords = this.records;
  }

  onAction(action: ITableAction, item: any) {
    this.eventEmitValue.action = action;
    this.eventEmitValue.record = item;

    this.onActionCliked.emit(this.eventEmitValue);
    this.autoCallActions(action, item);
  }

  getNameOfIDHeader() {
    let idName = this.colsHeader.filter(item => item.type == EType.id);
    return idName[0].keyName;
  }

  autoCallActions(action: ITableAction, record: any) {
    let recordId = record[this.getNameOfIDHeader()];
    if (action.name == EAction.delete && action.autoCall) {
      this.showConfirmMessage = !this.showConfirmMessage;
    } else if ((action.name == EAction.edit || action.name == EAction.view) && action.autoCall) {
      this.router.navigateByUrl(action.apiName_or_route + '/' + recordId);
    } else if (action.name == EAction.block && action.autoCall) {
      this.showBlockConfirmationMessage = !this.showBlockConfirmationMessage;
    } else if (action.name == EAction.active && action.autoCall) {
      this.showActiveConfirmationMessage = !this.showActiveConfirmationMessage;
    }
  }

  onConfirmMessage() {
    let action = this.eventEmitValue.action;
    let recordId = this.eventEmitValue.record[this.getNameOfIDHeader()];
    this.showConfirmMessage = false;
    this.showBlockConfirmationMessage = false;
    this.callDeleteAction(action, recordId);
  }

  callDeleteAction(action: ITableAction, id: any) {
    this.ApiService.delete(action.apiName_or_route, id).subscribe(res => {
      if (res) {
        this.filterdRecords = this.filterdRecords.filter((item: any) => item[this.getNameOfIDHeader()] != id)
        this.reloadGetAllApi.emit(true);
      }
    })
  }

  onActiveConfirmMessage() {
    let action = this.eventEmitValue.action;
    let recordId = this.eventEmitValue.record[this.getNameOfIDHeader()];
    this.showActiveConfirmationMessage = false;

    this.callActiveApi(action, recordId);
  }

  callActiveApi(action: ITableAction, id: any) {
  
    this.ApiService.putWithId(action.apiName_or_route, id).subscribe(res => {
      if (res) {
        this.reloadGetAllApi.emit(true);
      }
    })
  }

  convertDate(originalDate: string) {
    const date = new Date(originalDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  getCurrentTime(originalDate: string): string {
    const now = new Date(originalDate);
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const isAM = hours < 12;
    hours = hours % 12 || 12;
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${isAM ? 'AM' : 'PM'}`;
  }

  onToggleChange(checked: boolean, record: any, col: any) {
    if (col.toggleOptions.autoCall) {
      this.api_update(checked, record, col)
    } else {
      this.onstatusChanged.emit({
        status: checked,
        record: record,
        col: col
      })
    }


  }

  api_update(checkedValue: boolean, record: any, col: any) {
    let payload = record
    payload[col.keyName] = checkedValue
    console.log("TableComponent  api_update  payload:", payload)

    this.ApiService.put(col.toggleOptions.apiName, payload).subscribe(res => {
      if (res) {
        // sweet alert is active or not
      }
    })
  }

  getOrderStatusColorById(id: number): string | null {

    const statuses = [
      { name: 'Pending', id: 0, color: '#c1cd6a' },
      { name: 'Paid', id: 1, color: '#c1cd6a' },
      { name: 'AssignedToProvider', id: 2, color: '#b16acd' },
      { name: 'InTheWay', id: 3, color: '#ccc053' },
      { name: 'TryingSolveProblem', id: 4, color: '#9b9d9c' },
      { name: 'Solved', id: 5, color: '#49e97c' },
      { name: 'ClientConfirmation', id: 6, color: '#49e97c' },
      { name: 'Completed', id: 7, color: '#49e97c' },
      { name: 'Canceled', id: 8, color: '#e94949' }
    ];



    const status = statuses.find(status => status.id === id);
    return status ? status.color : null;
  }

  getSpecialOrderStatusColorById(id: number): string | null {
    const statuses = [
      { name: 'Pending', id: 1, color: '#c1cd6a' },
      { name: 'Completed', id: 2, color: '#3fac4e' },
      { name: 'Canceled', id: 3, color: '#c32722' }
    ];

    const status = statuses.find(status => status.id === id);
    console.log(status);

    return status ? status.color : null;
  }

}
