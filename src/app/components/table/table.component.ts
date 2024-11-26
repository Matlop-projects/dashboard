import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DialogComponent } from '../dialog/dialog.component';

export enum EAction {
  delete = "delete",
  view = "view",
  edit = "edit"
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
  editor='editor'
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
  show?: boolean
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, NgFor, NgIf, TooltipModule,DialogComponent],
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
  showConfirmMessage:boolean=false
  ApiService = inject(ApiService);
  router = inject(Router);
  eventEmitValue:any
  ngOnInit() {
    this.filterdRecords = this.records;
  }
  ngOnChanges() {
    this.filterdRecords = this.records;
  }
  onAction(action: ITableAction, item: any) {
    this.eventEmitValue.action=action;
    this.eventEmitValue.record=item;

    this.onActionCliked.emit(this.eventEmitValue.record);
    this.autoCallActions(action, item);
  }

  getNameOfIDHeader() {
    let idName = this.colsHeader.filter(item => item.type == EType.id);
    return idName[0].keyName;
  }


  autoCallActions(action: ITableAction, record: any) {
    let recordId = record[this.getNameOfIDHeader()];
    if (action.name == EAction.delete && action.autoCall) {
      this.showConfirmMessage=!this.showConfirmMessage
    } else if ((action.name == EAction.edit || action.name == EAction.view) && action.autoCall) {
      console.log("TableComponent  autoCallActions  action.apiName_or_route+'/'+recordId:", action.apiName_or_route + '/' + recordId)
      this.router.navigateByUrl(action.apiName_or_route + '/' + recordId);
    }
  }
  onConfirmMessage(){
    let action =this.eventEmitValue.action
    let recordId =this.eventEmitValue.record[this.getNameOfIDHeader()] 
    this.callDeleteAction(action, recordId);
  }

  callDeleteAction(action: ITableAction, id: any) {
    this.ApiService.delete(action.apiName_or_route, id).subscribe(res => {
      if (res)
        this.filterdRecords = this.filterdRecords.filter((item: any) => item[this.getNameOfIDHeader()] != id)
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



}
