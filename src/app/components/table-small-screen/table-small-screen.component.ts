import { JsonPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Card } from 'primeng/card';
import { EAction, EType, IcolHeader, ITableAction } from '../table/table.component';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DialogComponent } from '../dialog/dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
export enum ETableShow {
  header = "header",
  content = "content"
}
export interface IcolHeaderSmallTable extends IcolHeader {
  showAs?: ETableShow,
}
@Component({
  selector: 'app-table-small-screen',
  standalone: true,
  imports: [Card, Accordion,SlicePipe, TranslatePipe,AccordionHeader,DialogComponent, AccordionPanel, AccordionContent, NgIf, NgFor, JsonPipe],
  templateUrl: './table-small-screen.component.html',
  styleUrl: './table-small-screen.component.scss'
})
export class TableSmallScreenComponent implements OnInit, OnChanges {
  EType = EType
  @Input()type='card'
  @Input({ required: true }) colsHeaderSmallTable: IcolHeaderSmallTable[] = []
  @Input({ required: true }) records: any = []
  @Input() actions: ITableAction[] = []
  @Output() onActionCliked = new EventEmitter()
  @Output() commentValue=new EventEmitter()
  showConfirmMessage:boolean=false
  ApiService = inject(ApiService)
  router = inject(Router)
  filterdRecords: any[] = []
  eventEmitValue:any={action:{},record:{}}
  sortedItemsIncolsHeaderSmallTable:any[]=[]

  ngOnInit() {
    this.filterdRecords = this.records
    this.sortedItems()
  }
  ngOnChanges() {
    this.filterdRecords = this.records
    this.sortedItems()

  }

  onAction(action: ITableAction, item: any,event:MouseEvent) {
    event.stopPropagation() //not work;
    this.eventEmitValue.action=action;
    this.eventEmitValue.record=item;
    this.onActionCliked.emit(this.eventEmitValue)
    this.autoCallActions(action, item)
  }

  getNameOfIDHeader() {
    let idName = this.colsHeaderSmallTable.filter(item => item.type == EType.id)
    return idName[0].keyName
  }

onclickComment(comment:string){
  this.commentValue.emit(comment)
}
  autoCallActions(action: ITableAction, record: any) {
    let recordId = record[this.getNameOfIDHeader()]
    if (action.name == EAction.delete && action.autoCall) {
      this.showConfirmMessage=!this.showConfirmMessage
    } else if ((action.name == EAction.edit || action.name == EAction.view) && action.autoCall) {
      this.router.navigateByUrl(action.apiName_or_route + '/' + recordId)
    }
  }

  onConfirmMessage(){
    let action =this.eventEmitValue.action;
    let recordId =this.eventEmitValue.record[this.getNameOfIDHeader()] ;
    this.showConfirmMessage=false
    this.callDeleteAction(action, recordId);
  }
  callDeleteAction(action: ITableAction, id: any) {
    this.ApiService.delete(action.apiName_or_route, id).subscribe(res => {
      if (res)
        this.filterdRecords = this.records.filter((item: any) => item[this.getNameOfIDHeader()] != id)
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
   sortedItems() {
     this.sortedItemsIncolsHeaderSmallTable = this.colsHeaderSmallTable.sort((firstRecord, secondRecord) => (firstRecord.type === EType.editor ? 1 : secondRecord.type === EType.editor ? -1 : 0));
  }
}
