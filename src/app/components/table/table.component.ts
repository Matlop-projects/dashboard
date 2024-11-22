import {  JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

export enum EAction {
  delete="delete",
  view="view",
  edit="edit"
}
export interface ITableAction{
    name:EAction,
    apiName_or_route:string,
    autoCall:boolean
}
export enum EType {
  id="id",
  text="text",
  image="image",
  object="object",
  status="status",
  index="index",
  actions="actions"
}
interface INested{
  img:string,
  text:string
}
export interface IcolHeader {
    header:string,
     keyName:string,
     type:EType,
     nested?:INested,
     actions?:any[]
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule,NgFor,NgIf,JsonPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})

export class TableComponent implements OnInit ,OnChanges{
  @Input()showrecordIndex=false
  @Input({required:true})records:any=[]
  @Input()hasPaginator:boolean=true
  filterdRecords:any=[]
  @Input({required:true})colsHeader:IcolHeader[]=[]
  @Input()actions:any[]=[]
  @Output()onActionCliked=new EventEmitter()

  ApiService =inject(ApiService)
  router=inject(Router)
  
ngOnInit() {
  this.filterdRecords=this.records
 }
ngOnChanges() {
  this.filterdRecords=this.records
}
onAction(action:ITableAction,item:any){      
      this.onActionCliked.emit({action:action,record:item})
      this.autoCallActions(action,item)
}

getNameOfIDHeader(){
  let idName =this.colsHeader.filter(item=>item.type==EType.id)
  return idName[0].keyName
}


autoCallActions(action:ITableAction,record:any){
  let recordId =record[this.getNameOfIDHeader()]
  if(action.name==EAction.delete && action.autoCall){
       this.callDeleteAction(action,recordId)
  }else if((action.name==EAction.edit||action.name==EAction.view) && action.autoCall){
    console.log("TableComponent  autoCallActions  action.apiName_or_route+'/'+recordId:", action.apiName_or_route+'/'+recordId)
    this.router.navigateByUrl(action.apiName_or_route+'/'+recordId)
  }
}

callDeleteAction(action:ITableAction,id:any){
    this.ApiService.delete(action.apiName_or_route,id).subscribe(res => {
      if(res)
      this.filterdRecords= this.filterdRecords.filter((item:any) => item[this.getNameOfIDHeader()]!=id)
    })
}

}