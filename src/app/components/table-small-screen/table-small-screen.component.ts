import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Card } from 'primeng/card';
import { EAction, EType, IcolHeader, ITableAction } from '../table/table.component';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
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
  imports: [Card, Accordion, AccordionHeader, AccordionPanel, AccordionContent, NgIf, NgFor, JsonPipe],
  templateUrl: './table-small-screen.component.html',
  styleUrl: './table-small-screen.component.scss'
})
export class TableSmallScreenComponent implements OnInit, OnChanges {
  EType = EType
  @Input({ required: true }) colsHeaderSmallTable: IcolHeaderSmallTable[] = []
  @Input({ required: true }) records: any = []
  @Input() actions: ITableAction[] = []
  @Output() onActionCliked = new EventEmitter()

  ApiService = inject(ApiService)
  router = inject(Router)
  filterdRecords: any[] = []
  ngOnInit() {
    this.filterdRecords = this.records
  }
  ngOnChanges() {
    this.filterdRecords = this.records

  }
  onAction(action: ITableAction, item: any) {

    let valueEmit = { action: action, record: item }
    this.onActionCliked.emit(valueEmit)
    this.autoCallActions(action, item)
  }

  getNameOfIDHeader(headerType: EType) {
    let idName = this.colsHeaderSmallTable.filter(item => item.type == headerType)
    return idName[0].keyName
  }


  autoCallActions(action: ITableAction, record: any) {
    let recordId = record[this.getNameOfIDHeader(EType.id)]
    if (action.name == EAction.delete && action.autoCall) {
      this.callDeleteAction(action, recordId)
    } else if ((action.name == EAction.edit || action.name == EAction.view) && action.autoCall) {
      this.router.navigateByUrl(action.apiName_or_route + '/' + recordId)
    }
  }

  callDeleteAction(action: ITableAction, id: any) {
    this.ApiService.delete(action.apiName_or_route, id).subscribe(res => {
      if (res)
        this.filterdRecords = this.records.filter((item: any) => item[this.getNameOfIDHeader(EType.id)] != id)
    })
  }
}
